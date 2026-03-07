import app from "./app.js"
import { pool } from "./config/db.js"

const PORT = process.env.PORT || 3000

// Check database connection before starting server
const startServer = async () => {
  try {
    if (pool.getConnection) {
      // MySQL
      const connection = await pool.getConnection()
      console.log("MySQL Database connected successfully")
      connection.release()
    } else {
      // PostgreSQL
      const client = await pool.connect()
      console.log("PostgreSQL Database connected successfully")
      client.release()
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Database connection failed:", err)
    process.exit(1)
  }
}

startServer()
