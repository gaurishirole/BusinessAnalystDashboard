import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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
