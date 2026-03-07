import * as userService from '../services/user.service.js'

export const getProfile = async (req, res, next) => {
  try {
    // req.user viene del middleware de autenticación (verifyToken)
    const user = await userService.getUserProfile(req.user.login)
    
    res.json({
      message: 'Perfil de usuario obtenido',
      user
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.login, req.body)
    
    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    })
  } catch (error) {
    next(error)
  }
}
