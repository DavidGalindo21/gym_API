import { actualizarUsuario, obtenerPerfilUsuarioConEstado, obtenerRutinasPorUsuario } from "../controllers/userController.js";
import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";

const router = Router();
/**
 * @swagger
 * /user/actualizar:
 *   put:
 *     summary: Actualizar el perfil
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       403:
 *        description: Solo el administrador puede cambiar el correo
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al actualizar el usuario
 */
router.put(
  "/user/actualizar",
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
/**
 * @swagger
 * /user/estado:
 *   get:
 *     summary: Obtener información de membresias del usuario por correo
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Muestra el perfil del usuario con estado de membresía
 *       204:
 *        description: El usuario no tiene membresías registradas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el perfil del usuario
 */
router.get("/user/estado", verificarToken, permitirRol("user"), obtenerPerfilUsuarioConEstado);
export default router;
