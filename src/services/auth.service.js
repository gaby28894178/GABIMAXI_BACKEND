import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto' // Para soportar contraseñas antiguas MD5

const JWT_SECRET = process.env.JWT_SECRET || process.env.TOKEN_SECRET || 'supersecretkey_change_this_in_production'

export const register = async (userData) => {
  // Aceptamos 'password' o 'pswd' del frontend
  const { name, email } = userData
  const login = userData.login || userData.username || userData.user || email
  const rawPassword = userData.password || userData.pswd

  if (!email) {
    const err = new Error('El email es requerido')
    err.statusCode = 400
    throw err
  }

  if (!login) {
    const err = new Error('El login es requerido')
    err.statusCode = 400
    throw err
  }

  if (!rawPassword) {
    const err = new Error('La contraseña es requerida')
    err.statusCode = 400
    throw err
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findByPk(login)
  if (existingUser) {
    const err = new Error('El usuario ya existe')
    err.statusCode = 409
    throw err
  }

  // Hash de la contraseña con bcrypt (seguridad moderna)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(rawPassword, salt)

  // Crear usuario con Sequelize
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
  console.log(`[Auth] Intentando login para usuario: ${login}`)
  
  const identifier = String(login || '').trim()
  const user = identifier.includes('@')
    ? await User.findOne({ where: { email: identifier } })
    : await User.findByPk(identifier)
  
  if (!user) {
    console.log(`[Auth] Usuario ${identifier} no encontrado`)
    const err = new Error('Usuario no encontrado')
    err.statusCode = 404
    throw err
  }

  console.log(`[Auth] Usuario encontrado. Verificando contraseña...`)

  let isPasswordValid = false
  let needsMigration = false

  // Detectar tipo de contraseña
  if (user.pswd.startsWith('$2')) {
    // Bcrypt
    isPasswordValid = await bcrypt.compare(password, user.pswd)
  } else {
    // Legacy MD5
    const md5Hash = crypto.createHash('md5').update(password).digest('hex')
    
    // Comparamos lowercase para asegurar compatibilidad
    if (md5Hash.toLowerCase() === user.pswd.toLowerCase()) {
      isPasswordValid = true
      needsMigration = true
    } else if (password === user.pswd) {
      // Texto plano
      isPasswordValid = true
      needsMigration = true
    }
  }

  if (!isPasswordValid) {
    console.log(`[Auth] Contraseña inválida para ${identifier}`)
    const err = new Error('Contraseña inválida')
    err.statusCode = 401
    throw err
  }

  // Auto-migración a Bcrypt
  if (needsMigration) {
    console.log(`[Seguridad] Migrando contraseña de usuario ${identifier} a Bcrypt...`)
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(password, salt)
    
    user.pswd = newHash
    await user.save()
  }

  // Generar Token JWT (24h para mejor UX en producción)
  const token = jwt.sign(
    { 
      login: user.login, 
      email: user.email,
      role: user.tipo_usuario_id 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  const userJson = user.toJSON()
  const { pswd: pass, ...userWithoutPassword } = userJson

  return { user: userWithoutPassword, token }
}
