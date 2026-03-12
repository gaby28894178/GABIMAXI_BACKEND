import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'
import User from './models/user.model.js'

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

const handleSemilla = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.RENDER
    if (isProduction) {
      return res.status(403).json({ message: 'Ruta no disponible en producción' })
    }

    const rawNumero = req.params.numero ?? req.params.number
    const requested = Number.parseInt(rawNumero, 10)
    if (Number.isNaN(requested) || requested < 1) {
      return res.status(400).json({ message: 'Parámetro numero inválido' })
    }

    const cantidad = Math.min(requested, 20)
    const password = '123456'
    const passwordHash = await bcrypt.hash(password, 10)

    const usuarios = []
    let creados = 0
    let omitidos = 0

    for (let i = 0; i < cantidad; i += 1) {
      const login = i === 0 ? 'demo' : `demo${i}`
      const email = i === 0 ? 'demo@demo.com' : `demo${i}@demo.com`
      const name = i === 0 ? 'Demo' : `Demo ${i}`

      try {
        const [user, created] = await User.findOrCreate({
          where: { login },
          defaults: {
            login,
            email,
            name,
            pswd: passwordHash,
            active: 'Y'
          }
        })

        usuarios.push({ login: user.login, email: user.email, created })
        if (created) creados += 1
        else omitidos += 1
      } catch (error) {
        usuarios.push({ login, email, created: false, error: error?.message })
        omitidos += 1
      }
    }

    return res.status(201).json({
      message: 'Semilla ejecutada',
      cantidadSolicitada: requested,
      cantidadProcesada: cantidad,
      creados,
      omitidos,
      password,
      usuarios
    })
  } catch (error) {
    next(error)
  }
}

const handleSemillaUno = (req, res, next) => {
  req.params.numero = '1'
  return handleSemilla(req, res, next)
}

app.post('/semilla', handleSemillaUno)
app.get('/semilla', handleSemillaUno)
app.post('/semilla/:numero', handleSemilla)
app.get('/semilla/:numero', handleSemilla)
app.post('/semilla/:number', handleSemilla)
app.get('/semilla/:number', handleSemilla)

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
