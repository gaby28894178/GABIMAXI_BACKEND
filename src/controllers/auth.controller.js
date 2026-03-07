import * as authService from "../services/auth.service.js"

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json({ message: "User registered successfully", user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { login, pswd } = req.body
    const { user, token } = await authService.login(login, pswd)
    res.json({ message: "Login successful", user, token })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}
