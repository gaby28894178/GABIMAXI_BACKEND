import mysql from "mysql2/promise"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

let pool
let isPostgres = false

// Detectar si estamos en Vercel (o si hay URL de Postgres definida)
// Vercel Postgres suele usar POSTGRES_URL, DATABASE_URL
// Si estamos en local y no hay variables de Postgres, asumimos MySQL
const hasPostgresConfig = process.env.POSTGRES_URL || process.env.DATABASE_URL

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
