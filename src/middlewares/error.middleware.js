// Middleware global para manejo de errores
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  // Errores de Sequelize (base de datos)
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      message: 'Error de validación', 
      errors: err.errors.map(e => e.message) 
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      message: 'Datos duplicados', 
      errors: err.errors.map(e => e.message) 
    })
  }

  // Error genérico del servidor
  const statusCode = err.statusCode || err.status || 500
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}
