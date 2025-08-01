import { userModel } from "../models/userModel.js"
import Routine from '../models/routineModel.js';
import bcrypt from 'bcrypt';


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

    // Realiza la busqueda
    const usuario = await userModel.findOne(query);
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

    if (correo !== undefined) {
      if (!correo.trim()) {
        return res.status(400).json({ error: "Correo no puede estar vacío" });
      }
      usuario.correo = correo.trim();
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