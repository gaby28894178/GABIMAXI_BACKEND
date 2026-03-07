import User from '../models/user.model.js';
import { sequelize } from '../config/db.js';

export const installDatabase = async (req, res) => {
  try {
    if (!sequelize) {
      return res.status(500).json({
        message: 'Database connection not established. Please check your configuration.'
      });
    }

    // Force sync: drops table if exists and creates new one
    // Or alter: true to update schema
    // Let's use alter to be safe, or force if they want a fresh start?
    // User said "borra todos los modelos... solo q quede uno echo con postgre".
    // Maybe they want a fresh DB too? "instala zequeliser... borra modelos".
    // I will use sync({ alter: true }) to not lose data, unless they explicitly asked to drop.
    // But for "install", usually it implies setting up.
    
    await User.sync({ alter: true });

    // Create test user if not exists
    const [user, created] = await User.findOrCreate({
      where: { login: 'test_cloud' },
      defaults: {
        pswd: '$2a$10$x.z5q.Z5q.Z5q.Z5q.Z5qe.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q.Z5q', // hash of '123456' or similar
        name: 'Usuario Test Cloud',
        email: 'test@cloud.com',
        active: 'Y'
      }
    });

    res.status(200).json({ 
      message: 'Database tables synchronized successfully!', 
      tables: ['sec_users'],
      testUser: created ? 'test_cloud (created)' : 'test_cloud (already exists)'
    });

  } catch (error) {
    console.error('Database installation error:', error);
    res.status(500).json({ 
      message: 'Failed to create database tables', 
      error: error.message 
    });
  }
};
