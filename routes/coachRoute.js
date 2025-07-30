import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { getUserCoach, actualizarUsuario } from "../controllers/coachController.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";
const route = Router();

// Rutas para el coach
/**
 * @swagger
 * /coach/alumnos:
 *   get:
 *     summary: Obtener los usuarios asignados al coach
 *     tags: [Coach]
 *     responses:
 *       200:
 *         description: Usuarios asignados al coach encontrados
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *        description: No se encontraron usuarios asignados a este entrenador
 *       500:
 *         description: Error del servidor al obtener los usuarios asignados al coach
 */
route.get('/coach/alumnos', verificarToken,permitirRol('coach'),getUserCoach)
/**
 * @swagger
 * /coach/{correo}/{valor}:
 *   put:
 *     summary: Actualizar el perfil por correo
 *     tags: [Coach]
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
route.get('/coach/:key/:value', verificarToken,permitirRol('coach'),actualizarUsuario)

export default route;