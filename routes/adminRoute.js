import { actualizarUsuario, eliminarUsuario, getCoaches} from "../controllers/adminController.js";
import { getUsers } from '../controllers/adminController.js'
import { Router } from "express";
import { verificarToken } from '../middlewares/authMiddleware.js'
import { permitirRol } from '../middlewares/roleMiddleware.js'
import { generarReporteClientes } from "../controllers/reporteClientController.js";
import {generarReporteMembresias} from "../controllers/reporteMembController.js"

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
 * /admin/coaches:
 *   get:
 *     summary: Obtener todos los coaches
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Coaches encontrados
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       404:
 *         description: El coach asignado no existe o no es válido
 */
router.get('/admin/coaches', verificarToken,permitirRol('admin'), getCoaches)
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
/**
 * @swagger
 * /admin/{correo}/{valor}:
 *   delete:
 *     summary: Eliminar usuarios o coach por id o correo
 *     description: Permite al administrador eliminar un usuario o coach por su id o correo.
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       204:
 *        description: Petición realizada con exito pero sin nada que devolver
 *       400:
 *         description: Campo de búsqueda no permitido
 *       403:
 *         description: No tienes permiso para eliminar usuarios
 *       404:
 *         description: Usuario no encontrado
 */

router.delete('/admin/usuarios/:key/:value', verificarToken, permitirRol('admin'), eliminarUsuario);
/**
 * @swagger
 * /admin/reporte/cientes:
 *   get:
 *     summary: Obtener reporte
 *     description: Permite al administrador descargar un reporte de clientes.
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       403:
 *         description: No tienes permiso para eliminar usuarios
 *       404:
 *         description: No hay clientes registrados
 */

router.get('/admin/reporte/clientes', verificarToken, permitirRol('admin'), generarReporteClientes);
/**
 * @swagger
 * /admin/reporte/membresias:
 *   get:
 *     summary: Obtener reporte membresias
 *     description: Permite al administrador descargar un reporte de membresias.
 *     tags: [Administrador]
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       403:
 *         description: No tienes permiso para eliminar usuarios
 *       404:
 *         description: No hay clientes registrados
 */
router.get('/admin/reportes/membresias', verificarToken, permitirRol('admin'), generarReporteMembresias)


export default router;
