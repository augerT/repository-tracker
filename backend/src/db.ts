import { Pool } from 'pg';

// Maybe make these environment variables later
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'repos',
  password: 'tylerauger',
  port: 5432,
});

export default pool;