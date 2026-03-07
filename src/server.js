import app from "./app.js"
import { sequelize } from "./config/db.js"
import User from "./models/user.model.js"

const PORT = process.env.PORT || 3000

// Check database connection before starting server
const startServer = async () => {
  try {
    if (sequelize) {
      await sequelize.authenticate()
      console.log("Database connected successfully via Sequelize")
      
      // Sync models (create tables if not exist)
      // alter: true updates tables if model changes (careful in production)
      await sequelize.sync({ alter: true })
      console.log("Database synced successfully")
    } else {
      console.warn("⚠️ Running without Database Connection (Check your .env)")
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
