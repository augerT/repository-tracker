import { describe, it, expect, beforeEach } from 'vitest';
import { repoFieldResolvers } from '../repo';
import pool from '../../db';

describe('Repo Field Resolvers - Integration', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE repos RESTART IDENTITY CASCADE');
  });

  describe('latestReleaseTag', () => {
    it('should map latest_release_tag to latestReleaseTag', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url, latest_release_tag) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', 'v18.2.0')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const tag = repoFieldResolvers.latestReleaseTag(repo);

      expect(tag).toBe('v18.2.0');
    });

    it('should return null when no release tag', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const tag = repoFieldResolvers.latestReleaseTag(repo);

      expect(tag).toBeNull();
    });
  });

  describe('latestReleaseDate', () => {
    it('should map latest_release_date to latestReleaseDate', async () => {
      const releaseDate = new Date('2024-01-15T10:30:00Z');

      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url, latest_release_date) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', $1)
        RETURNING *
      `, [releaseDate]);

      const repo = inserted.rows[0];
      const date = repoFieldResolvers.latestReleaseDate(repo);

      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBe(releaseDate.getTime());
    });

    it('should return null when no release date', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const date = repoFieldResolvers.latestReleaseDate(repo);

      expect(date).toBeNull();
    });
  });

  describe('latestReleaseId', () => {
    it('should map latest_release_id to latestReleaseId', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url, latest_release_id) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', 123456)
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const id = repoFieldResolvers.latestReleaseId(repo);

      expect(id).toBe(123456);
    });

    it('should return null when no release id', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const id = repoFieldResolvers.latestReleaseId(repo);

      expect(id).toBeNull();
    });
  });

  describe('latestReleaseNotes', () => {
    it('should map latest_release_notes to latestReleaseNotes', async () => {
      const releaseNotes = '## What Changed\n\n- Bug fix\n- New feature';

      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url, latest_release_notes) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', $1)
        RETURNING *
      `, [releaseNotes]);

      const repo = inserted.rows[0];
      const notes = repoFieldResolvers.latestReleaseNotes(repo);

      expect(notes).toBe(releaseNotes);
      expect(notes).toContain('Bug fix');
    });

    it('should return null when no release notes', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const notes = repoFieldResolvers.latestReleaseNotes(repo);

      expect(notes).toBeNull();
    });
  });

  describe('seenByUser', () => {
    it('should map seen_by_user to seenByUser', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url, seen_by_user) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', true)
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const seen = repoFieldResolvers.seenByUser(repo);

      expect(seen).toBe(true);
    });

    it('should default to false for new repos', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING *
      `);

      const repo = inserted.rows[0];
      const seen = repoFieldResolvers.seenByUser(repo);

      expect(seen).toBe(false);
    });
  });
});