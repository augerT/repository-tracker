import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


// Maybe make these environment variables later
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'repos',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default pool;