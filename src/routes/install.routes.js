import { Router } from "express"
import { installDatabase } from "../controllers/install.controller.js"

const router = Router()

// Endpoint público para inicializar la base de datos en la nube
// En producción real esto debería estar protegido, pero para este caso de uso
// simplifica la vida del usuario.
router.get("/db", installDatabase)

export default router
