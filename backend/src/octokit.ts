import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

// Add a token to increase rate limits, should work fine without one too
// Testing should definitely use a token to avoid hitting limits!
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, 
});

if (!process.env.GITHUB_TOKEN) {
  console.warn('⚠️  No GITHUB_TOKEN found. API rate limit: 60/hour. Add token to .env for 5000/hour.');
}

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

export async function fetchLatestRelease(owner: string, name: string): Promise<LatestRelease | null> {
  try {
    const { data } = await octokit.repos.getLatestRelease({
      owner,
      repo: name,
    });

    return {
      tag: data.tag_name,
      publishedAt: data.published_at,
      notes: data.body,
      latestReleaseId: data.id,
    };
  } catch (error) {
    console.error(`Error fetching latest release for ${owner}/${name}:`, error);
    return null;
  }
}