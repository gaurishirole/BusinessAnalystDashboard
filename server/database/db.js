import pg from 'pg';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text, params) => pool.query(text, params);

export const connectDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`Database connected successfully: ${res.rows[0].now}`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};
