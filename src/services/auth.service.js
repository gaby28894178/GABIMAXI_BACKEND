import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto" // Built-in module for MD5

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export const register = async (userData) => {
  const existingUser = await User.findByPk(userData.login)
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(userData.pswd, 10)
  const newUser = await User.create({
    ...userData,
    pswd: hashedPassword,
    // active: 'Y' (default in model)
    // f_insert: NOW (default in model)
  })

  return newUser.toJSON()
}

export const login = async (login, password) => {
  const user = await User.findByPk(login)
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
      
      // Update password using Sequelize instance method or static update
      user.pswd = newHash;
      await user.save();
  }

  const token = jwt.sign(
    { login: user.login, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  )

  const userJson = user.toJSON()
  const { pswd, ...userWithoutPassword } = userJson
  return { user: userWithoutPassword, token }
}
