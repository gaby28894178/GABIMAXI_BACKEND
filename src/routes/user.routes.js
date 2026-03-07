import { Router } from "express"
import * as userController from "../controllers/user.controller.js"
import { authenticateToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/me", authenticateToken, userController.getProfile)

export default router
