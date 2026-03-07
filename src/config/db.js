import mysql from "mysql2/promise"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

let pool

// Detectar si estamos en Vercel (o si hay URL de Postgres definida)
// Vercel Postgres suele usar POSTGRES_URL
const isPostgres = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (isPostgres) {
  // Configuración para PostgreSQL (Nube / Vercel)
  const { Pool } = pg
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  
  console.log("Using PostgreSQL Database (Cloud)")
  
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  // Adaptador para que Postgres se comporte parecido a MySQL en las consultas simples
  // Esto es un "hack" para no reescribir todo el código, pero lo ideal es separar modelos
  pool.getConnection = async () => {
    const client = await pool.connect()
    return client
  }

} else {
  // Configuración para MySQL (Local)
  console.log("Using MySQL Database (Local)")
  
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "maxipela_turnos",
    port: process.env.DB_PORT || 4343, // Puerto local correcto
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
}

export { pool, isPostgres }
