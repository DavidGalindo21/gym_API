import configuracion from "../config/configuracion.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { userModel } from "../models/userModel.js";

const SECRET_KEY = configuracion.SECRET_KEY;

export const register = async (req, res) => {
    try {
        const { telefono, nombre, correo, password, rol, coach } = req.body;

        // Validar que el coach existe y tiene rol "coach"
        if (coach) {
            const coachExistente = await userModel.findOne({ _id: coach, rol: "coach" });
            if (!coachExistente) {
                return res.status(400).json({ mensaje: "El coach asignado no existe o no es válido." });
            }
        }

        // verificar si ya existe
        const existe = await userModel.findOne({correo})
        if(existe) return res.status(400).json({error: 'El correo ya está registrado'})

        // encriptar contraseña
        const hashedPassword = await bcrypt.hash(password,10)

        const nuevoUsuario = new userModel({
            telefono,
            nombre,
            correo,
            password: hashedPassword,
            rol: rol || "user",
            coach: coach || ""
        })

        await nuevoUsuario.save()

        res.status(200).json({message: 'Usuario registrado exitosamente'})

    } catch (error) {
        res.status(500).json({error: 'Error al registrar el usuario'})
        console.error(error)
    }
}

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // verificar si el usuario existe
        const usuario = await userModel.findOne({ correo });
        if (!usuario) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });

        const match = await bcrypt.compare(password, usuario.password)
        if (!match) return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });

        // generar token
        const token = jwt.sign({id:usuario._id,rol:usuario.rol},SECRET_KEY,{expiresIn: '1h'})

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario._id,
                telefono: usuario.telefono,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        })

    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}