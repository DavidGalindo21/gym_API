import { actualizarUsuario } from "../controllers/userController.js";
import { Router } from "express";
import { verificarToken } from '../middlewares/authMiddleware.js'
import { permitirRol } from '../middlewares/roleMiddleware.js'

const router = Router();

router.put('/user/actualizarPerfil',verificarToken,permitirRol('user'),actualizarUsuario)

export default  router;