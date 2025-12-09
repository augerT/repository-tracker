import { describe, it, expect, beforeEach } from 'vitest';
import { getRepo, fetchLatestRelease } from '../octokit';
import pool from '../db';

describe('Octokit Integration', () => {

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE repos RESTART IDENTITY CASCADE');
  });
  
  describe('getRepo', () => {
    it('should fetch real repository information', async () => {
      const result = await getRepo('facebook', 'react');

      expect(result).not.toBe(false);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: 'react',
        owner: 'facebook',
      });
    });

    it('should return false for non-existent repository', async () => {
      const result = await getRepo('nonexistent-user-12345', 'nonexistent-repo-67890');

      expect(result).toBe(false);
    });
  });

  describe('fetchLatestRelease', () => {
    it('should fetch real latest release', async () => {
      const result = await fetchLatestRelease('facebook', 'react');

      expect(result).not.toBeNull();
      expect(result).toMatchObject({
        tag: expect.stringMatching(/^v\d+\.\d+\.\d+/),  // Matches v18.x.x format
        publishedAt: expect.any(String),
        latestReleaseId: expect.any(Number),
      });

      if (result?.notes) {
        expect(typeof result.notes).toBe('string');
      }
    });

    it('should return null for repo without releases', async () => {
      // Use a real repo that has no releases
      const result = await fetchLatestRelease('octocat', 'Hello-World');

      // This might be null or might have releases - just test it doesn't crash
      expect(result).toBeNull();
    });
  });
});