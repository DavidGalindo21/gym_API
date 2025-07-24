import jwt from "jsonwebtoken";
import configuracion from "../config/configuracion.js";
import {userModel} from "../models/userModel.js";

const SECRET_KEY = configuracion.SECRET_KEY

export const verificarToken = async(req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const usuario = await userModel.findById(decoded.id)

    if (!usuario) return res.status(401).json({error:'Usuario no encontrado'})

        req.user = {
            id: usuario._id,
            rol: usuario.rol
        }
        console.log('Header Authorization:', req.header('Authorization'));

        next()

  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}