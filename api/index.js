import app from '../src/app.js';
import { sequelize } from '../src/config/db.js';

export default async function handler(req, res) {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    
    // Sync models (safe to run, checks if tables exist/need update)
    // In production with high traffic, use migrations instead.
    await sequelize.sync({ alter: true });
    
    console.log('Database connected and synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return app(req, res);
}
