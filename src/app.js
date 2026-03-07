import express from "express"
import morgan from "morgan"
import cors from "cors"
import { isMissingDB } from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import installRoutes from "./routes/install.routes.js"

const app = express()

// Middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Middleware para interceptar peticiones si falta la BD en Vercel
app.use((req, res, next) => {
  if (isMissingDB) {
    // Si la ruta es la de instalación, permitimos que pase (aunque probablemente falle si no hay conexión, 
    // pero tal vez el usuario quiera ver el mensaje de error de esa ruta específica)
    // O mejor, devolvemos una página bonita explicando qué hacer.
    
    // Si la petición acepta HTML, devolvemos una página explicativa
    if (req.accepts('html')) {
      return res.status(503).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Base de datos no configurada</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #333; }
            h1 { color: #E00; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .step { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #0070f3; }
            code { background: #eee; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
            .btn { display: inline-block; background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>⚠️ Base de datos no conectada</h1>
          <p>La aplicación se ha desplegado correctamente en Vercel, pero no se ha detectado una configuración de base de datos PostgreSQL.</p>
          
          <div class="step">
            <h3>Solución rápida:</h3>
            <p>1. Ve a tu proyecto en el panel de control de <strong>Vercel</strong>.</p>
            <p>2. Haz clic en la pestaña <strong>Storage</strong>.</p>
            <p>3. Crea una nueva base de datos (selecciona <strong>Postgres</strong>).</p>
            <p>4. Una vez creada, Vercel configurará automáticamente las variables de entorno.</p>
            <p>5. Vuelve a desplegar tu aplicación (Redeploy) o espera unos minutos.</p>
          </div>

          <p>Una vez conectada la base de datos, podrás usar la ruta <a href="/api/install/db">/api/install/db</a> para crear las tablas necesarias.</p>
        </body>
        </html>
      `)
    }
    
    // Si es una petición API (JSON), devolvemos un JSON con el error
    return res.status(503).json({
      error: "Service Unavailable",
      message: "Database configuration missing. Please connect a Postgres database in Vercel Storage tab.",
      action_required: "Go to Vercel Dashboard > Storage > Create Postgres Database"
    })
  }
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/install", installRoutes)

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Maxipela Turnos API" })
})

export default app
