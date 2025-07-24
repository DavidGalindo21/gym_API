import { actualizarUsuario } from "../controllers/userController.js";
import { Router } from "express";
import { verificarToken } from '../middlewares/authMiddleware.js'
import { permitirRol } from '../middlewares/roleMiddleware.js'

const router = Router();

router.put('/admin/actualizarPerfil',verificarToken,permitirRol('admin'),actualizarUsuario)

export default router;