import * as authService from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user
    })
  } catch (error) {
    next(error) // Pasar al middleware de errores
  }
}

export const login = async (req, res, next) => {
  try {
    // Permitir 'password' o 'pswd' (compatibilidad con frontend legacy)
    const { login } = req.body
    const password = req.body.password || req.body.pswd
    
    if (!login || !password) {
      return res.status(400).json({ message: 'Login y contraseña son requeridos' })
    }

    const result = await authService.login(login, password)
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token: result.token,
      user: result.user
    })
  } catch (error) {
    next(error)
  }
}
