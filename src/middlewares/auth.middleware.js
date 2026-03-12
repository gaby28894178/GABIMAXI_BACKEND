import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || process.env.TOKEN_SECRET || 'supersecretkey_change_this_in_production'

if (!process.env.JWT_SECRET && !process.env.TOKEN_SECRET) {
  console.warn('⚠️ ADVERTENCIA: JWT_SECRET no configurado, usando valor por defecto (INSEGURO)')
}

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' })
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).json({ message: 'Acceso denegado: Token inválido' })
  }
}
