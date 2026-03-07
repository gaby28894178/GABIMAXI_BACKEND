import dotenv from 'dotenv';
dotenv.config();

// Determine which DB to use
const shouldUsePostgres = process.env.POSTGRES_URL || process.env.DB_CLIENT === 'pg';

let userModel;

if (shouldUsePostgres) {
  const { userModel: pgModel } = await import('./user.model.pg.js');
  userModel = pgModel;
} else {
  const { userModel: mysqlModel } = await import('./user.model.mysql.js');
  userModel = mysqlModel;
}

export { userModel };
