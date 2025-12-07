import { Octokit } from '@octokit/rest';

const octokit = new Octokit({});

interface LatestRelease {
  tag: string;
  publishedAt: string | null;
  latestReleaseId: number;
  notes: string | null | undefined;
}

interface RepoInfo {
  id: number;
  name: string;
  owner: string;
}

export async function getRepo(owner: string, name: string): Promise<RepoInfo | false> {
  try {
    const result = await octokit.repos.get({
      owner,
      repo: name,
    });

    return {
      id: result.data.id,
      name: result.data.name,
      owner: result.data.owner.login,
    }
  } catch (error) {
    console.error(`Repo ${owner}/${name} not found:`, error);
    return false;
  }
}

export async function fetchLatestRelease(owner: string, repo: string): Promise<LatestRelease | null> {
  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner,
      repo,
    });

    return {
      tag: data.tag_name,
      publishedAt: data.published_at,
      notes: data.body,
      latestReleaseId: data.id,
    };
  } catch (error) {
    console.error(`Error fetching latest release for ${owner}/${repo}:`, error);
    return null;
  }
}