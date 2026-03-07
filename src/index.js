import app from './app.js'
import { sequelize } from './config/db.js'
import User from './models/user.model.js' // Importar modelos para asegurar que se registren

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // 1. Conectar a la Base de Datos
    await sequelize.authenticate()
    console.log('✅ Conexión a Base de Datos (PostgreSQL) establecida correctamente.')

    // 2. Sincronizar Modelos (Crear tablas si no existen)
    // alter: true -> actualiza columnas sin borrar datos
    // force: true -> BORRA todo y recrea (peligroso en prod)
    await sequelize.sync({ alter: true })
    console.log('✅ Modelos sincronizados con la base de datos.')

    // 3. Iniciar Servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`)
    })

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

startServer()
