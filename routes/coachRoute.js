import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { getUserCoach, actualizarUsuario, subirRutina, obtenerRutinasPorCoach } from "../controllers/coachController.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });
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
route.put('/coach/:key/:value', verificarToken,permitirRol('coach'),actualizarUsuario)

/**
 * @swagger
 * /coach/{correo}/{valor}:
 *   put:
 *     summary: Subir archivo PDF de rutina
 *     description: Permite al coach subir un archivo PDF de rutina para un usuario específico.     
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
route.post('/coach/rutina/:studentId', verificarToken, permitirRol('coach'), upload.single('pdf'), subirRutina);

route.get('/coach/rutinas', verificarToken, permitirRol('coach'), obtenerRutinasPorCoach);


export default route;