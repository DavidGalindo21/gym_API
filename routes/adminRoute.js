import { actualizarUsuario, getCoaches } from "../controllers/adminController.js";
import { getUsers } from '../controllers/adminController.js'
import { Router } from "express";
import { verificarToken } from '../middlewares/authMiddleware.js'
import { permitirRol } from '../middlewares/roleMiddleware.js'

const router = Router();
/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Usuarios encontrado
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: Usuario no encontrado
 */

router.get('/admin/usuarios', verificarToken,permitirRol('admin'), getUsers)
/**
 * @swagger
 * /admin/couches:
 *   get:
 *     summary: Obtener todos los couches
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Couches encontrado
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: El coach asignado no existe o no es válido
 */
router.get('/admin/couches', verificarToken,permitirRol('admin'), getCoaches)
/**
 * @swagger
 * /admin/{correo}/{valor}:
 *   put:
 *     summary: Actualizar el perfil por correo
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/admin/:key/:value',verificarToken,permitirRol('admin'),actualizarUsuario)



export default router;