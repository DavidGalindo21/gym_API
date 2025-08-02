import { Router } from "express";
import { insertMembresia, eliminarMembresia, getMembresias } from "../controllers/membresiaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { permitirRol } from "../middlewares/roleMiddleware.js";

const router = Router()

router.get("/admin/obtenermembresia",verificarToken,permitirRol("admin"),getMembresias)

router.post("/admin/crearmembresia",verificarToken,permitirRol("admin"),insertMembresia)

router.delete("/admin/membresia/:key/:value",verificarToken,permitirRol("admin"),eliminarMembresia)

export default router