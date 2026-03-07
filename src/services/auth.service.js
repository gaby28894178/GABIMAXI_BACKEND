import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto' // Para soportar contraseñas antiguas MD5

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_this_in_production'

export const register = async (userData) => {
  const { login, pswd, name, email } = userData

  // Verificar si el usuario ya existe
  const existingUser = await User.findByPk(login)
  if (existingUser) {
    throw new Error('El usuario ya existe')
  }

  // Hash de la contraseña con bcrypt (seguridad moderna)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(pswd, salt)

  // Crear usuario con Sequelize (evita SQL Injection automáticamente)
  const newUser = await User.create({
    login,
    pswd: hashedPassword,
    name,
    email,
    active: 'Y'
  })

  // Devolver usuario sin la contraseña
  const userJson = newUser.toJSON()
  const { pswd: pass, ...userWithoutPassword } = userJson
  
  return userWithoutPassword
}

export const login = async (login, password) => {
  const user = await User.findByPk(login)
  
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  let isPasswordValid = false
  let needsMigration = false

  // Detectar tipo de contraseña (bcrypt empieza con $2...)
  if (user.pswd.startsWith('$2')) {
    isPasswordValid = await bcrypt.compare(password, user.pswd)
  } else {
    // Soporte para contraseñas antiguas (Legacy PHP - MD5)
    // Asumimos MD5 simple
    const md5Hash = crypto.createHash('md5').update(password).digest('hex')
    
    if (md5Hash === user.pswd) {
      isPasswordValid = true
      needsMigration = true // Marcar para migrar a bcrypt
    } else if (password === user.pswd) {
      // Soporte para texto plano (muy inseguro, pero posible legacy)
      isPasswordValid = true
      needsMigration = true
    }
  }

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas')
  }

  // Auto-migración a Bcrypt si era contraseña vieja
  if (needsMigration) {
    console.log(`[Seguridad] Migrando contraseña de usuario ${login} a Bcrypt...`)
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(password, salt)
    
    // Actualizar en base de datos
    user.pswd = newHash
    await user.save()
  }

  // Generar Token JWT
  const token = jwt.sign(
    { 
      login: user.login, 
      email: user.email,
      role: user.tipo_usuario_id // Incluir rol en el token si es útil
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  const userJson = user.toJSON()
  const { pswd: pass, ...userWithoutPassword } = userJson

  return { user: userWithoutPassword, token }
}
