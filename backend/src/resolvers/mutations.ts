import pool from '../db';
import { getRepo, fetchLatestRelease } from '../octokit';
import { queries } from './queries';

export const mutations = {
  addRepo: async (_parent: undefined, args: { owner: string; name: string }) => {
    const repo = await getRepo(args.owner, args.name);
    if (!repo) {
      throw new Error('Repository not found on GitHub');
    }

    const result = await pool.query(
      'INSERT INTO repos (id, name, owner, url, seen_by_user) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [repo.id, repo.name, repo.owner, repo.url, false]
    );

    return result.rows[0];
  },

  removeRepo: async (_parent: undefined, { id }: { id: string }) => {
    const result = await pool.query('DELETE FROM repos WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0;
  },

  syncLatestRelease: async (_parent: undefined, { id }: { id: string }) => {
    const repo = await queries.repo(_parent, { id });
    if (!repo) {
      throw new Error('Repository not found in database');
    }

    const latestRelease = await fetchLatestRelease(repo.owner, repo.name);
    if (!latestRelease) {
      throw new Error('No releases found for this repository');
    }

    if (latestRelease.latestReleaseId === repo.latestReleaseId) {
      return repo;
    }

    const result = await pool.query(
      `UPDATE repos 
       SET latest_release_tag = $1, 
           latest_release_name = $2, 
           latest_release_date = $3, 
           latest_release_url = $4,
           latest_release_id = $5,
           latest_release_notes = $6,
           seen_by_user = FALSE
       WHERE id = $7
       RETURNING *`,
      [latestRelease.tag, latestRelease.name, latestRelease.publishedAt, latestRelease.url, latestRelease.latestReleaseId, latestRelease.notes, id]
    );

    return result.rows[0];
  },

  syncAllRepos: async () => {
    try {
      const repos = await queries.trackedRepos();

      // Sync each repo
      const syncResults = await Promise.allSettled(
        repos.map(async (repo) => {
          const latestRelease = await fetchLatestRelease(repo.owner, repo.name);

          if (!latestRelease) {
            throw new Error(`No releases found for repository ${repo.owner}/${repo.name}`);
          }

          // The query returns a repo from the DB, so the keys are in snake_case
          if(latestRelease.latestReleaseId == repo.latest_release_id) {
            return repo.id; // No update needed
          }
          
          await pool.query(
            `UPDATE repos 
              SET latest_release_tag = $1, 
                  latest_release_name = $2, 
                  latest_release_date = $3, 
                  latest_release_url = $4, 
                  latest_release_notes = $5,
                  latest_release_id = $6,
                  seen_by_user = false
              WHERE id = $7`,
            [
              latestRelease.tag,
              latestRelease.name,
              latestRelease.publishedAt,
              latestRelease.url,
              latestRelease.notes,
              latestRelease.latestReleaseId,
              repo.id
            ]
          );

          return repo.id;
        })
      );

      // Return count of successfully synced repos
      const successCount = syncResults.filter(r => r.status === 'fulfilled').length;
      return successCount;
    } catch (error) {
      console.error('Error syncing all repos:', error);
      throw new Error('Failed to sync repositories');
    }
  },

  markRepoSeen: async (_parent: undefined, { id }: { id: string }) => {
    const result = await pool.query(
      'UPDATE repos SET seen_by_user = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows.length > 0;
  },
};