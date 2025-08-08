import configuracion from "../config/configuracion.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { userModel } from "../models/userModel.js";

const SECRET_KEY = configuracion.SECRET_KEY;
export const register = async (req, res) => {
    try {
        const { telefono, nombre, correo, password, rol = "user", coach } = req.body;
   // Validaciones de campos obligatorios
    if (!telefono || typeof telefono !== "string") {
      return res.status(400).json({ error: "El teléfono es obligatorio y debe ser una cadena de texto." });
    }

   if ( !nombre || typeof nombre !== "string" || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(nombre.trim())) {
    return res.status(400).json({ error: "El nombre es obligatorio, debe ser una cadena de texto válida y solo debe contener letras." });
   }

    if (!correo || typeof correo !== "string" || !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo)) {
     return res.status(400).json({ error: "El correo es obligatorio, debe ser una cadena de texto válida y tener formato de correo electrónico." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "La contraseña es obligatoria y debe tener al menos 6 caracteres." });
    }
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

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const nuevoUsuario = new userModel({
            telefono,
            nombre,
            correo,
            password: hashedPassword,
            rol,
            coach: coachIdToSave, 
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