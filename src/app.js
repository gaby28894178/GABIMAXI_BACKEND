import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

// Middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Maxipela Turnos API" })
})

export default app
