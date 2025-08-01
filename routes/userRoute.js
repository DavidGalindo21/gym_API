import { actualizarUsuario, obtenerRutinasPorUsuario } from "../controllers/userController.js";
import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";

const router = Router();
/**
 * @swagger
 * /user/{correo}/{valor}:
 *   put:
 *     summary: Actualizar el perfil por correo
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al actualizar el usuario
 */
router.put(
  "/user/:key/:value",
  verificarToken,
  permitirRol("user"),
  actualizarUsuario
);

/**
 * @swagger
 * /user/rutinas:
 *   get:
 *     summary: Obtener las rutinas asignadas al usuario
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rutinas encontradas
 *       204:
 *         description: No hay rutinas disponibles
 *       500:
 *         description: Error del servidor
 */
router.get("/user/rutinas", verificarToken, permitirRol("user"), obtenerRutinasPorUsuario);

export default router;
