import mysql from "mysql2/promise"
import pg from "pg"
import dotenv from "dotenv"

// Cargar variables de entorno (prioridad: .env.local de Vercel > .env normal)
dotenv.config({ path: '.env.local' })
dotenv.config()

let pool
let isPostgres = false
let isMissingDB = false

// Detectar si estamos en Vercel (o si hay URL de Postgres definida)
const hasPostgresConfig = process.env.POSTGRES_URL || process.env.DATABASE_URL
// Detectar si estamos en el entorno de Vercel (Vercel define esta variable)
const isVercelEnvironment = process.env.VERCEL === '1'

if (hasPostgresConfig) {
  // Configuración para PostgreSQL (Nube / Vercel)
  const { Pool } = pg
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  
  // Detectar si es localhost para desactivar SSL
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
  
  if (isVercelEnvironment && isLocal) {
    console.error("❌ ERROR FATAL: Estás intentando conectar a 'localhost' desde Vercel.")
    console.error("❌ Vercel no puede acceder a tu base de datos local.")
    console.error("❌ Usa una base de datos en la nube (Vercel Postgres, Neon, Supabase, etc.).")
    throw new Error("Invalid DB Configuration: Cannot use localhost in Vercel. Use a Cloud Database.")
  }

  console.log(`Using PostgreSQL Database (${isLocal ? 'Local' : 'Cloud / Vercel'})`)
  
  const poolConfig = {
    connectionString
  }

  // Solo habilitamos SSL si NO es local (para producción/nube)
  if (!isLocal) {
    poolConfig.ssl = {
      rejectUnauthorized: false
    }
  }
  
  pool = new Pool(poolConfig)

  // Adaptador para que Postgres se comporte parecido a MySQL en las consultas simples
  pool.getConnection = async () => {
    const client = await pool.connect()
    return client
  }
  
  isPostgres = true

} else {
  // Si estamos en Vercel pero NO hay configuración de Postgres, esto es un error crítico.
  // No podemos conectar a localhost desde Vercel.
  if (isVercelEnvironment) {
    console.error("❌ ERROR CRÍTICO: Despliegue en Vercel detectado pero SIN configuración de base de datos.")
    console.error("❌ Por favor, ve a la pestaña 'Storage' en tu proyecto de Vercel y crea una base de datos Postgres.")
    // No lanzamos error para que la app no crashee, pero marcamos el estado
    isMissingDB = true
    pool = null
  } else {
    // Configuración para MySQL (Local)
    // Usamos esto porque en tu PC local tienes MySQL en el puerto 4343
    console.log("Using MySQL Database (Local - Fallback)")
    
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "maxipela_turnos",
      port: process.env.DB_PORT || 4343, // Puerto local de tu MySQL
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
    
    isPostgres = false
  }
}

export { pool, isPostgres, isMissingDB }
