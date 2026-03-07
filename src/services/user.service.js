import User from '../models/user.model.js'

export const getUserProfile = async (login) => {
  const user = await User.findByPk(login)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  // Convertir a JSON y eliminar la contraseña
  const userJson = user.toJSON()
  const { pswd, ...userWithoutPassword } = userJson

  return userWithoutPassword
}

export const updateUserProfile = async (login, updateData) => {
  const user = await User.findByPk(login)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  // Actualizar solo los campos permitidos
  if (updateData.name) user.name = updateData.name
  if (updateData.email) user.email = updateData.email
  if (updateData.active) user.active = updateData.active

  // Sequelize automáticamente actualiza f_update vía hooks
  await user.save()

  // Retornar sin contraseña
  const userJson = user.toJSON()
  const { pswd, ...userWithoutPassword } = userJson
  return userWithoutPassword
}
