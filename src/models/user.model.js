import { pool } from "../config/db.js"

export const userModel = {
  findUserByLogin: async (login) => {
    const [rows] = await pool.query("SELECT * FROM sec_users WHERE login = ?", [
      login,
    ])
    return rows[0]
  },

  createUser: async (userData) => {
    const { login, pswd, name, email } = userData
    const [result] = await pool.query(
      "INSERT INTO sec_users (login, pswd, name, email, active, f_insert) VALUES (?, ?, ?, ?, 'Y', NOW())",
      [login, pswd, name, email]
    )
    return { login, name, email, active: "Y" }
  },

  updatePassword: async (login, newHash) => {
    await pool.query("UPDATE sec_users SET pswd = ? WHERE login = ?", [newHash, login]);
  }
}
