import {register,login} from '../controllers/authController.js'
import { Router } from 'express'
import { verificarToken } from '../middlewares/authMiddleware.js'
import { permitirRol } from '../middlewares/roleMiddleware.js'


const router = Router()

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: Registro exitoso
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       400:
 *        description: El correo ya está registrado
 *       500:
 *         description: Error del servidor al registrar el usuario
 */
router.post('/admin/register', verificarToken,permitirRol("admin"),register)
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Login]
 *     security: []   # <--- Esto desactiva la seguridad para esta ruta
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login)

export default router