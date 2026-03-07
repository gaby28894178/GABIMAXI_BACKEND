import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

// Forzamos PostgreSQL para Vercel
console.log("Using PostgreSQL Database (Forced for Vercel)")

// Configuración de conexión. 
// Prioridad: POSTGRES_URL (Vercel) > DATABASE_URL > Variables individuales
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

const config = connectionString 
  ? {
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      // En local a veces no se necesita SSL, pero en nube sí.
      // Si falla en local, quitar ssl.
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }

const pool = new Pool(config)

// Adaptador simple para mantener compatibilidad si se usaba pool.getConnection
pool.getConnection = async () => {
    const client = await pool.connect()
    return client
}

// Exportar isPostgres siempre como true
const isPostgres = true

export { pool, isPostgres }
