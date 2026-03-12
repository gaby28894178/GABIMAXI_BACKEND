import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

// Cargar variables de entorno (prioridad: .env.local de Vercel > .env normal)
dotenv.config({ path: '.env.local' })
dotenv.config()

// Obtener la URL de conexión desde .env
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error('❌ ERROR FATAL: No se encontró DATABASE_URL o POSTGRES_URL en el archivo .env')
  console.error('Variables disponibles:', Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE')))
  
  // En serverless, no hacer exit, lanzar error
  if (process.env.VERCEL || process.env.RENDER) {
    throw new Error('DATABASE_URL o POSTGRES_URL no configurada')
  }
  process.exit(1)
}

// Detectar si estamos en producción (Vercel, Render, o NODE_ENV)
const isProduction = process.env.VERCEL || process.env.RENDER || process.env.NODE_ENV === 'production'
const shouldResetOnBoot = !isProduction && process.env.PRESERVE_DB !== 'true'

console.log(`🔧 Configurando Sequelize - Ambiente: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)

// Configuración de Sequelize optimizada para serverless
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desactivar logs SQL en producción
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false // Necesario para Vercel/Render/Heroku
    } : false
  },
  pool: {
    max: 3,        // Reducido para serverless (menos conexiones concurrentes)
    min: 0,        // Permitir 0 conexiones idle
    acquire: 30000,
    idle: 5000,    // Cerrar conexiones idle más rápido en serverless
    evict: 1000    // Revisar conexiones idle cada segundo
  }
})

// Variable para controlar la inicialización
let isInitialized = false

// Función para inicializar la base de datos (llamar solo una vez)
export const initializeDatabase = async () => {
  if (isInitialized) {
    console.log('⚡ Database ya inicializada, reutilizando conexión')
    return
  }

  try {
    // Autenticar conexión
    await sequelize.authenticate()
    console.log('✅ Conexión a PostgreSQL establecida')

    // Sincronizar modelos SOLO si es necesario
    // En producción, usar { alter: false } o migrations
    const syncOptions = isProduction
      ? { alter: false }
      : (shouldResetOnBoot ? { force: true } : { alter: true })

    await sequelize.sync(syncOptions)
    console.log('✅ Modelos sincronizados')

    isInitialized = true
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error)
    throw error
  }
}

export { sequelize }
