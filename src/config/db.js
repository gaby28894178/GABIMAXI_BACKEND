import mysql from "mysql2/promise"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

let pool
let isPostgres = false

// Detectar si estamos en Vercel (o si hay URL de Postgres definida)
const hasPostgresConfig = process.env.POSTGRES_URL || process.env.DATABASE_URL
// Detectar si estamos en el entorno de Vercel (Vercel define esta variable)
const isVercelEnvironment = process.env.VERCEL === '1'

if (hasPostgresConfig) {
  // Configuración para PostgreSQL (Nube / Vercel)
  const { Pool } = pg
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  
  console.log("Using PostgreSQL Database (Cloud / Vercel)")
  
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

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
    // No lanzamos error aquí para permitir que el servidor arranque y muestre logs, 
    // pero las consultas fallarán.
  }

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

export { pool, isPostgres }
