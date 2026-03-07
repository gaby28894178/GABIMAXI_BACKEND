import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Support for connection string (common in Vercel/Cloud providers)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const config = connectionString 
  ? {
      connectionString,
      ssl: {
        rejectUnauthorized: false // Often required for cloud DBs
      }
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };

export const pool = new Pool(config);

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});
