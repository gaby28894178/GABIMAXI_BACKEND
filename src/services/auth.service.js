import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto' // Para soportar contraseñas antiguas MD5

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_this_in_production'

export const register = async (userData) => {
  // Aceptamos 'password' o 'pswd' del frontend
  const { login, name, email } = userData
  const rawPassword = userData.password || userData.pswd

  if (!rawPassword) {
    throw new Error('La contraseña es requerida')
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findByPk(login)
  if (existingUser) {
    throw new Error('El usuario ya existe')
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
  
  const user = await User.findByPk(login)
  
  if (!user) {
    console.log(`[Auth] Usuario ${login} no encontrado`)
    throw new Error('Credenciales inválidas')
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
    console.log(`[Auth] Contraseña inválida para ${login}`)
    throw new Error('Credenciales inválidas')
  }

  // Auto-migración a Bcrypt
  if (needsMigration) {
    console.log(`[Seguridad] Migrando contraseña de usuario ${login} a Bcrypt...`)
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(password, salt)
    
    user.pswd = newHash
    await user.save()
  }

  // Generar Token JWT
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
