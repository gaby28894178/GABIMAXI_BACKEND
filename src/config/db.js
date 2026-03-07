import { Sequelize } from "sequelize"
import dotenv from "dotenv"

// Cargar variables de entorno (prioridad: .env.local de Vercel > .env normal)
dotenv.config({ path: '.env.local' })
dotenv.config()

let sequelize
let isMissingDB = false

// Detectar si estamos en Vercel (o si hay URL de Postgres definida)
const hasPostgresConfig = process.env.POSTGRES_URL || process.env.DATABASE_URL
// Detectar si estamos en el entorno de Vercel (Vercel define esta variable)
const isVercelEnvironment = process.env.VERCEL === '1'

if (hasPostgresConfig) {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  
  // Detectar si es localhost para desactivar SSL
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
  
  if (isVercelEnvironment && isLocal) {
    console.error("❌ ERROR FATAL: Estás intentando conectar a 'localhost' desde Vercel.")
    console.error("❌ Vercel no puede acceder a tu base de datos local.")
    console.error("❌ Usa una base de datos en la nube (Vercel Postgres, Neon, Supabase, etc.).")
    throw new Error("Invalid DB Configuration: Cannot use localhost in Vercel. Use a Cloud Database.")
  }

  console.log(`Using PostgreSQL Database (${isLocal ? 'Local' : 'Cloud / Vercel'}) with Sequelize`)
  
  const dialectOptions = {}
  
  // Solo habilitamos SSL si NO es local (para producción/nube)
  if (!isLocal) {
    dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: false
    }
  }

  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions
  })

} else {
  // Si estamos en Vercel pero NO hay configuración de Postgres, esto es un error crítico.
  if (isVercelEnvironment) {
    console.error("❌ ERROR CRÍTICO: Despliegue en Vercel detectado pero SIN configuración de base de datos.")
    console.error("❌ Por favor, ve a la pestaña 'Storage' en tu proyecto de Vercel y crea una base de datos Postgres.")
    isMissingDB = true
    sequelize = null
  } else {
    // Fallback local (si no hay variable POSTGRES_URL)
    // Asumimos que quieres usar Postgres localmente si no hay config
    console.log("⚠️ No POSTGRES_URL found. Please configure your .env file.")
    isMissingDB = true
    sequelize = null
  }
}

export { sequelize, isMissingDB }
