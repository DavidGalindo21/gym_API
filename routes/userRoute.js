import { actualizarUsuario } from "../controllers/userController.js";
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

export default router;
