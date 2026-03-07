import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

// Rutas Públicas
router.post('/register', authController.register)
router.post('/login', authController.login)

// Rutas Protegidas (ejemplo)
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user, message: 'Acceso autorizado' })
})

export default router
