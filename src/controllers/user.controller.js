import * as userService from "../services/user.service.js"

export const getProfile = async (req, res) => {
  try {
    // req.user is populated by the auth middleware
    const user = await userService.getUserProfile(req.user.login)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
