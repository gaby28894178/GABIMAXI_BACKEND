import { userModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto" // Built-in module for MD5

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export const register = async (userData) => {
  const existingUser = await userModel.findUserByLogin(userData.login)
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(userData.pswd, 10)
  const newUser = await userModel.createUser({
    ...userData,
    pswd: hashedPassword,
  })

  return newUser
}

export const login = async (login, password) => {
  const user = await userModel.findUserByLogin(login)
  if (!user) {
    throw new Error("Invalid credentials")
  }

  let isPasswordValid = false
  let needsMigration = false

  // Check if password is bcrypt (starts with $2a$ or $2b$ or $2y$)
  if (user.pswd.startsWith("$2")) {
    isPasswordValid = await bcrypt.compare(password, user.pswd)
  } else {
    // Fallback for Legacy Passwords (e.g., MD5 from PHP)
    // Assuming PHP used md5($pass)
    const md5Hash = crypto.createHash('md5').update(password).digest('hex')
    
    if (md5Hash === user.pswd) {
      isPasswordValid = true
      needsMigration = true
    } else if (password === user.pswd) {
        // Fallback for Plain Text (unlikely but possible)
        isPasswordValid = true
        needsMigration = true
    }
  }

  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  // Auto-migrate to Bcrypt if it was a legacy password
  if (needsMigration) {
      console.log(`Migrating password for user ${user.login} to bcrypt...`);
      const newHash = await bcrypt.hash(password, 10);
      // We need a method to update the password directly. 
      // Since we don't have a specific updatePassword method exposed yet, 
      // we might need to add it to user.model or use a raw query here?
      // For now, let's assume we can ignore the update or add a TODO.
      // Better: Add updatePassword to user.model quickly.
      await userModel.updatePassword(user.login, newHash);
  }

  const token = jwt.sign(
    { login: user.login, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  )

  const { pswd, ...userWithoutPassword } = user
  return { user: userWithoutPassword, token }
}
