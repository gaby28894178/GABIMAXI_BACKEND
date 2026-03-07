import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

// Todas las rutas de usuario requieren autenticación
router.use(verifyToken)

router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)

export default router
