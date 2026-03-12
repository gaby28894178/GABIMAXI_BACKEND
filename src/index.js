import app from './app.js'
import { initializeDatabase } from './config/db.js'
import User from './models/user.model.js' // Importar modelos para asegurar que se registren
import bcrypt from 'bcryptjs'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // Inicializar base de datos (conexión + sync)
    await initializeDatabase()

    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.RENDER
    if (!isProduction) {
      const requestedSeed = Number.parseInt(process.env.SEED_DEMOS || '5', 10)
      const seedCount = Math.min(Math.max(Number.isNaN(requestedSeed) ? 5 : requestedSeed, 5), 20)
      const password = '123456'
      const passwordHash = await bcrypt.hash(password, 10)

      const usersToCreate = Array.from({ length: seedCount }, (_, i) => {
        const login = i === 0 ? 'demo' : `demo${i}`
        const email = i === 0 ? 'demo@demo.com' : `demo${i}@demo.com`
        const name = i === 0 ? 'Demo' : `Demo ${i}`
        return { login, email, name, pswd: passwordHash, active: 'Y' }
      })

      await User.bulkCreate(usersToCreate, { ignoreDuplicates: true })
      console.log(`🌱 Seed demos: ${seedCount} usuarios listos`)
    }

    // Iniciar Servidor Express (solo para desarrollo local o Render)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌍 Escuchando en todas las interfaces (0.0.0.0)`)
    })

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

// Solo iniciar servidor si NO estamos en Vercel (serverless)
if (!process.env.VERCEL) {
  startServer()
} else {
  console.log('⚡ Modo Vercel detectado - usando serverless handler')
}
