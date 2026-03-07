import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar variables de entorno (prioridad: .env.local de Vercel > .env normal)
dotenv.config({ path: '.env.local' })
dotenv.config()

// Obtener la URL de conexión desde .env
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ ERROR FATAL: No se encontró DATABASE_URL o POSTGRES_URL en el archivo .env')
  process.exit(1)
}

// Configuración de Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desactivar logs de SQL en consola para producción (puedes poner console.log para debug)
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false // Necesario para algunas nubes como Vercel/Heroku
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

export { sequelize }
