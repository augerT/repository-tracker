import { describe, it, expect, beforeEach } from 'vitest';
import { queries } from '../queries';
import pool from '../../db';

describe('Query Resolvers - Integration', () => {
  beforeEach(async () => {
    // Clean slate for each test
    await pool.query('TRUNCATE TABLE repos RESTART IDENTITY CASCADE');
  });

  describe('trackedRepos', () => {
    it('should return empty array when no repositories exist', async () => {
      const result = await queries.trackedRepos();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return all repositories ordered by id', async () => {
      // Insert test data
      await pool.query(`
        INSERT INTO repos (name, owner, url) VALUES 
        ('react', 'facebook', 'https://github.com/facebook/react'),
        ('vue', 'vuejs', 'https://github.com/vuejs/vue'),
        ('angular', 'angular', 'https://github.com/angular/angular')
      `);

      const result = await queries.trackedRepos();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('react');
      expect(result[1].name).toBe('vue');
      expect(result[2].name).toBe('angular');

      // Verify ordering
      expect(result[0].id).toBeLessThan(result[1].id);
      expect(result[1].id).toBeLessThan(result[2].id);
    });

    it('should return all repository fields including nulls', async () => {
      await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
      `);

      const result = await queries.trackedRepos();

      expect(result[0]).toMatchObject({
        id: expect.any(Number),
        name: 'react',
        owner: 'facebook',
        url: 'https://github.com/facebook/react',
        latest_release_id: null,
        latest_release_tag: null,
        latest_release_date: null,
        latest_release_notes: null,
        seen_by_user: false,
      });
    });

    it('should return repositories with release information', async () => {
      const releaseDate = new Date('2024-01-01');

      await pool.query(`
        INSERT INTO repos (name, owner, url, latest_release_tag, latest_release_notes, latest_release_date, seen_by_user) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react', 'v18.0.0', '## What Changed\n\nBug fixes', $1, true)
      `, [releaseDate]);

      const result = await queries.trackedRepos();

      expect(result[0].latest_release_tag).toBe('v18.0.0');
      expect(result[0].latest_release_notes).toContain('Bug fixes');
      expect(result[0].seen_by_user).toBe(true);
    });
  });

  describe('repo', () => {
    it('should return null when repository does not exist', async () => {
      const result = await queries.repo(undefined, { id: '99999' });

      expect(result).toBeNull();
    });

    it('should return specific repository by id', async () => {
      // Insert multiple repos
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) VALUES 
        ('react', 'facebook', 'https://github.com/facebook/react'),
        ('vue', 'vuejs', 'https://github.com/vuejs/vue'),
        ('angular', 'angular', 'https://github.com/angular/angular')
        RETURNING id
      `);

      const secondRepoId = inserted.rows[1].id;
      const result = await queries.repo(undefined, { id: secondRepoId.toString() });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(secondRepoId);
      expect(result?.name).toBe('vue');
      expect(result?.owner).toBe('vuejs');
    });

    it('should return repository with all fields', async () => {
      const releaseDate = new Date('2024-01-01');

      const inserted = await pool.query(`
        INSERT INTO repos (
          name, owner, url, 
          latest_release_id, latest_release_tag, latest_release_date, 
          latest_release_notes, seen_by_user
        ) 
        VALUES (
          'react', 'facebook', 'https://github.com/facebook/react',
          123456, 'v18.0.0', $1,
          '## Bug Fixes', true
        )
        RETURNING id
      `, [releaseDate]);

      const repoId = inserted.rows[0].id;
      const result = await queries.repo(undefined, { id: repoId.toString() });

      expect(result).toMatchObject({
        id: repoId,
        name: 'react',
        owner: 'facebook',
        url: 'https://github.com/facebook/react',
        latest_release_id: 123456,
        latest_release_tag: 'v18.0.0',
        latest_release_notes: '## Bug Fixes',
        seen_by_user: true,
      });
      expect(result?.latest_release_date).toBeInstanceOf(Date);
    });

    it('should handle numeric id as string', async () => {
      const inserted = await pool.query(`
        INSERT INTO repos (name, owner, url) 
        VALUES ('react', 'facebook', 'https://github.com/facebook/react')
        RETURNING id
      `);

      const repoId = inserted.rows[0].id;

      // Pass as string (GraphQL ID type)
      const result = await queries.repo(undefined, { id: String(repoId) });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(repoId);
    });
  });
});