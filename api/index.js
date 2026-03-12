import app from '../src/app.js';
import { sequelize, initializeDatabase } from '../src/config/db.js';

// Inicializar DB solo una vez (fuera del handler)
let dbInitialized = false;

const initDB = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('✅ Database initialized for serverless');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
};

// Inicializar en el arranque del módulo
initDB().catch(console.error);

export default async function handler(req, res) {
  try {
    // Asegurar que la DB esté lista
    await initDB();
    
    // Pasar el request a Express usando el handler correcto
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
