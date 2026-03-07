import User from "../models/user.model.js"

export const getUserProfile = async (login) => {
  const user = await User.findByPk(login)
  if (!user) {
    throw new Error("User not found")
  }
  const userJson = user.toJSON()
  const { pswd, ...userWithoutPassword } = userJson
  return userWithoutPassword
}
