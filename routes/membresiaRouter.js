import { Router } from "express";
import { insertMembresia, eliminarMembresia, getMembresias } from "../controllers/membresiaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";

const router = Router()
/**
 * @swagger
 * /admin/obtenermembresia:
 *   get:
 *     summary: Obtener las membresías
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de membresías encontradas
 *       204:
 *         description: No hay membresías disponibles
 *       500:
 *         description: Error del servidor
 */
router.get("/admin/obtenermembresia",verificarToken,permitirRol("admin"),getMembresias)
/**
 * @swagger
 * /admin/crearmembresia:
 *   post:
 *     summary: Crear una nueva membresía
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresía creada correctamente
 *       500:
 *         description: Error del servidor
 */
router.post("/admin/crearmembresia",verificarToken,permitirRol("admin"),insertMembresia)
/**
 * @swagger
 * /admin/membresias:
 *   delete:
 *     summary: Eliminar membresia a un usuario
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresia eliminada
 *       400:
 *         description: Campos de búsqueda no permitidos
 *       403:
 *         description: No tienes permiso para eliminar membresías
 *       204:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/admin/membresia/:key/:value",verificarToken,permitirRol("admin"),eliminarMembresia)

export default router