import { pool, isPostgres } from "../config/db.js"
import { userModel as mysqlModel } from "./user.model.mysql.js"

// Modelo para PostgreSQL (Vercel)
const pgModel = {
  findUserByLogin: async (login) => {
    const result = await pool.query("SELECT * FROM sec_users WHERE login = $1", [login])
    return result.rows[0]
  },

  createUser: async (userData) => {
    const { login, pswd, name, email } = userData
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

// Exportar el modelo correcto dinámicamente:
// - Si es Vercel (isPostgres = true) -> Usa pgModel
// - Si es Local (isPostgres = false) -> Usa mysqlModel (tu base de datos local)
export const userModel = isPostgres ? pgModel : mysqlModel
