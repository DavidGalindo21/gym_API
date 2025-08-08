import configuracion from "../config/configuracion.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { userModel } from "../models/userModel.js";

const SECRET_KEY = configuracion.SECRET_KEY;
export const register = async (req, res) => {
    try {
        const { nombre, telefono, correo, password, rol = "user", coach } = req.body;

        // Verificar si ya existe un usuario con ese correo
        const existe = await userModel.findOne({ correo });
        if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });

        let coachIdToSave = null;

        // Lógica según el rol
        if (rol === "user") {
            // Si es rol "user", debe tener un coach válido
            if (!coach) {
                return res.status(400).json({ error: "El usuario con rol 'user' debe tener un coach asignado." });
            }

            const coachExistente = await userModel.findOne({ _id: coach, rol: "coach" });
            if (!coachExistente) {
                return res.status(400).json({ error: "El coach asignado no existe o no es válido." });
            }

            coachIdToSave = coachExistente._id;
        } else {
            // Si es admin o coach, no se guarda el campo "coach"
            coachIdToSave = null;
        }

        // Crear nuevo usuario
        const nuevoUsuario = new userModel({
            telefono,
            nombre,
            correo,
            password,
            rol,
            coach: coachIdToSave, // Será null si no corresponde
        });

        await nuevoUsuario.save();

        res.status(200).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

export const login = async (req, res) => {
    try {
        console.log("BODY RECIBIDO:", req.body);
        const { correo, password } = req.body;

        // Validar que lleguen los datos requeridos
        if (!correo || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Correo y contraseña son requeridos' 
            });
        }

        // Verificar si el usuario existe
        const usuario = await userModel.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ 
                success: false,
                message: 'Usuario o contraseña incorrectos' 
            });
        }

        if (usuario.password !== password) {
            return res.status(400).json({ 
                success: false,
                message: 'Usuario o contraseña incorrectos' 
            });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        console.log("Login exitoso para:", correo);
        
        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: usuario._id,
                telefono: usuario.telefono,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ 
            success: false,
            message: 'Error al iniciar sesión' 
        });
    }
}