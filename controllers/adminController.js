import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios con rol "user"
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({ rol: "user" }).select("-password -__v");
    if (!users || users.length === 0)
      return res.status(404).json({ error: "No se encontraron usuarios" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Actualizar datos de un usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { key, value } = req.params;
    const { telefono, nombre, correo, password } = req.body;

    // Validar clave de búsqueda segura
    const camposPermitidos = ["correo", "_id", "uid", "nombre"];
    if (!camposPermitidos.includes(key)) {
      return res.status(400).json({ error: "Campo de búsqueda no permitido" });
    }

    // Buscar usuario
    const query = {};
    query[key] = value;
    const usuario = await userModel.findOne(query);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validaciones y actualizaciones
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
    if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para actualizar el correo" });
   }
      const correoLimpio = correo.trim();
      if (!correoLimpio) {
        return res.status(400).json({ error: "Correo no puede estar vacío" });
      }

      // Validar si el correo ya está en uso por otro usuario
      const existeCorreo = await userModel.findOne({ correo: correoLimpio });
      if (existeCorreo && existeCorreo._id.toString() !== usuario._id.toString()) {
        return res.status(400).json({ error: "El correo ya está en uso" });
      }

      usuario.correo = correoLimpio;
    }

    if (password !== undefined) {
      if (!password.trim()) {
        return res.status(400).json({ error: "La contraseña no puede estar vacía" });
      }
      usuario.password = await bcrypt.hash(password.trim(), 10);
    }

    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// Obtener todos los usuarios con rol "coach"
export const getCoaches = async (req, res) => {
  try {
    const coaches = await userModel.find({ rol: "coach" }).select("-password -__v");
    if (!coaches || coaches.length === 0) {
      return res.status(404).json({ error: "No se encontraron entrenadores" });
    }
    res.status(200).json(coaches);
  } catch (error) {
    console.error("Error al obtener entrenadores:", error);
    res.status(500).json({ error: "Error al obtener entrenadores" });
  }
};