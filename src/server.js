import app from "./app.js"
import { pool } from "./config/db.js"

const PORT = process.env.PORT || 3000

// Check database connection before starting server
pool.getConnection()
  .then((connection) => {
    console.log("Database connected successfully")
    connection.release()
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Database connection failed:", err)
    process.exit(1)
  })
