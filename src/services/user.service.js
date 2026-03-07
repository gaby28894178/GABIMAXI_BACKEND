import { userModel } from "../models/user.model.js"

export const getUserProfile = async (login) => {
  const user = await userModel.findUserByLogin(login)
  if (!user) {
    throw new Error("User not found")
  }
  const { pswd, ...userWithoutPassword } = user
  return userWithoutPassword
}
