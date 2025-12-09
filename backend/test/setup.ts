import { beforeAll, afterAll } from 'vitest';
import pool from '../src/db';

beforeAll(async () => {
  // Verify test database connection
  try {
    const result = await pool.query('SELECT current_database()');
    const dbName = result.rows[0].current_database;

    if (dbName !== 'repos_test') {
      throw new Error(`Wrong database! Expected repos_test, got ${dbName}`);
    }

    console.log('✅ Connected to test database:', dbName);
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
});

afterAll(async () => {
  // Close all connections
  await pool.end();
});