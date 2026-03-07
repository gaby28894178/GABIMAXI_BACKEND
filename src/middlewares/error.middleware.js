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
  res.status(500).json({ 
    message: 'Error interno del servidor ario crado',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
}
