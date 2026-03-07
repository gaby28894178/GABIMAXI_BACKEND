import dotenv from 'dotenv';
dotenv.config();

// Determine which DB to use
// Default to MySQL if POSTGRES_URL is not set and DB_CLIENT is not 'pg'
const shouldUsePostgres = process.env.POSTGRES_URL || process.env.DB_CLIENT === 'pg';

let pool;

if (shouldUsePostgres) {
  // Use PostgreSQL
  const { pool: pgPool } = await import('./db.pg.js');
  pool = pgPool;
  console.log('Using PostgreSQL configuration');
} else {
  // Use MySQL
  const { pool: mysqlPool } = await import('./db.mysql.js');
  pool = mysqlPool;
  console.log('Using MySQL configuration');
}

export { pool };
