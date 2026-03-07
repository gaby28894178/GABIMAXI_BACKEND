import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// Middlewares Globales
app.use(cors()) // Permitir peticiones de otros dominios
app.use(morgan('dev')) // Logger de peticiones HTTP
app.use(express.json()) // Parsear body JSON
app.use(express.urlencoded({ extended: false })) // Parsear formularios URL-encoded

// Ruta base para verificar estado
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Maxipela Turnos - Online',
    timestamp: new Date().toISOString()
  })
})

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Middleware de Manejo de Errores (debe ir al final)
app.use(errorHandler)

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

export default app
