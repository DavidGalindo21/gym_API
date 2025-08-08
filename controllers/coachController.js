import { userModel } from "../models/userModel.js"
import Routine from '../models/routineModel.js';
import bcrypt from 'bcryptjs';


//actualizar usario 
export const actualizarPerfil = async (req, res) => {
  try {
    const { telefono, nombre, correo, password } = req.body;

    const usuario = await userModel.findById(req.user.id); 
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (telefono !== undefined) {
      if (!telefono.trim()) {
        return res.status(400).json({ error: "Teléfono no puede estar vacío" });
      }
      usuario.telefono = telefono.trim();
    }

    if (nombre !== undefined) {
      if (!nombre.trim()) {
        return res.status(400).json({ error: "Nombre no puede estar vacío" });
      }
      usuario.nombre = nombre.trim();
    }

if ('correo' in req.body) {
  console.log("Intentando actualizar el correo:", correo);
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Solo el administrador puede cambiar el correo" });
  }

  const correoLimpio = (correo || "").trim();
  if (!correoLimpio) {
    return res.status(400).json({ error: "Correo no puede estar vacío" });
  }

  usuario.correo = correoLimpio;
}


    if (password !== undefined) {
      if (!password.trim()) {
        return res.status(400).json({ error: "La contraseña no puede estar vacía" });
      }
      usuario.password = await bcrypt.hash(password, 10);
    }

    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};



export const getUserCoach = async (req, res) => {
    try {
        const usersCouch = await userModel.find({rol: "user",coach: req.user.id }).select("-password -__v");
        if (!usersCouch || usersCouch.length === 0) return res.status(204).json({ error: "No se encontraron usuarios asignados a este entrenador" });
        res.status(200).json(usersCouch);
    } catch (error) {
        console.error("Error al obtener usuarios asignados al entrenador:", error);
        res.status(404).json({ error: "Error al obtener usuarios asignados al entrenador" });   
    }
}
export const actualizarUsuario = async (req, res) => {
  try {
    const { key, value } = req.params;
    const { telefono, nombre, correo, password } = req.body;

    const query = {};
    query[key] = value;

    // Buscar usuario
    const usuario = await userModel.findOne(query);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validar y actualizar teléfono
    if (telefono !== undefined) {
      if (
        typeof telefono !== "string" ||
        !telefono.trim()
      ) {
        return res.status(400).json({ error: "El teléfono es obligatorio y debe ser una cadena de texto." });
      }
      usuario.telefono = telefono.trim();
    }

    // Validar y actualizar nombre
    if (nombre !== undefined) {
      const nombreLimpio = nombre.trim();
      if (
        typeof nombre !== "string" ||
        !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(nombreLimpio)
      ) {
        return res.status(400).json({
          error: "El nombre es obligatorio, debe ser una cadena de texto válida y solo debe contener letras.",
        });
      }
      usuario.nombre = nombreLimpio;
    }

    // Validar y actualizar correo
    if (correo !== undefined) {
      const correoLimpio = correo.trim();
      if (
        typeof correo !== "string" ||
        !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correoLimpio)
      ) {
        return res.status(400).json({
          error: "El correo es obligatorio, debe ser una cadena de texto válida y tener formato de correo electrónico.",
        });
      }
      usuario.correo = correoLimpio;
    }

    // Validar y actualizar contraseña
    if (password !== undefined) {
      if (
        typeof password !== "string" ||
        password.trim().length < 6
      ) {
        return res.status(400).json({
          error: "La contraseña es obligatoria y debe tener al menos 6 caracteres.",
        });
      }
      usuario.password = await bcrypt.hash(password.trim(), 10);
    }

    // Guardar cambios
    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};


export const subirRutina = async (req, res) => {
  try {
    const { studentId } = req.params;
    const coachId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "Solo se permiten archivos PDF" });
    }

    const cliente = await userModel.findOne({ _id: studentId, coach: coachId });
    if (!cliente) {
      return res.status(403).json({ error: "Cliente no asignado a este coach" });
    }

    const rutina = new Routine({
      coachId,
      studentId,
      filename: req.file.originalname,
      filepath: req.file.path,
    });

    await rutina.save();
    res.status(201).json({ message: "Rutina subida exitosamente", rutina });
  } catch (error) {
    console.error("Error al subir rutina:", error);
    res.status(500).json({ error: "Error al subir la rutina" });
  }
};

export const obtenerRutinasPorCoach = async (req, res) => {
  try {
    const coachId = req.user?.id;
    const rutinas = await Routine.find({ coachId }).populate("studentId", "nombre correo");

    if (!rutinas || rutinas.length === 0) {
      return res.status(204).json({ message: "No se encontraron rutinas asignadas" });
    }

    res.status(200).json(rutinas);
  } catch (error) {
    console.error("Error al obtener rutinas:", error);
    res.status(500).json({ error: "Error al obtener rutinas del entrenador" });
  }
};