import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { getUserCoach, subirRutina, obtenerRutinasPorCoach,actualizarPerfil } from "../controllers/coachController.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

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
 * /coach/actualizarPerfil:
 *   put:
 *     summary: Actualizar el perfil 
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
route.put('/coach/editPerfil', verificarToken,permitirRol('coach'),actualizarPerfil)

/**
 * @swagger
 * /coach/{correo}/{valor}:
 *   post:
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
route.post('/coach/rutina/:studentId', verificarToken, permitirRol('coach'), (req, res, next) => {
  upload.single('pdf')(req, res, function(err) {
    if (err) {
      if (err.message === 'Solo se permiten archivos PDF') {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Error al subir archivo' });
    }
    next();
  });
}, subirRutina);
/**
 * @swagger
 * /coach/rutinas:
 *   get:
 *     summary: Obtener las rutinas subidas por el coach y asignadas a sus estudiantes
 *     tags: [Coach]
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
route.get('/coach/rutinas', verificarToken, permitirRol('coach'), obtenerRutinasPorCoach);

export default route;