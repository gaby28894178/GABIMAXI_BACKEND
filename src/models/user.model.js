import { pool } from "../config/db.js"

// Modelo EXCLUSIVO para PostgreSQL
export const userModel = {
  findUserByLogin: async (login) => {
    const result = await pool.query("SELECT * FROM sec_users WHERE login = $1", [login])
    return result.rows[0]
  },

  createUser: async (userData) => {
    const { login, pswd, name, email } = userData
    // Sintaxis de Postgres ($1, $2...) y RETURNING *
    const result = await pool.query(
      "INSERT INTO sec_users (login, pswd, name, email, active, f_insert) VALUES ($1, $2, $3, $4, 'Y', NOW()) RETURNING *",
      [login, pswd, name, email]
    )
    return result.rows[0]
  },
  
  updatePassword: async (login, newHash) => {
     await pool.query("UPDATE sec_users SET pswd = $1 WHERE login = $2", [newHash, login]);
  }
}
