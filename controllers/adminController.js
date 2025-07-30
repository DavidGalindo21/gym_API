import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({rol:"user"}).select("-password");
    if (!users || users.length === 0)
      return res.status(204).json({ error: "No se encontraron usuarios" });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};
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
export const getCoaches = async (req, res) => {
    try {
        const coaches = await userModel.find({ rol: "coach" }).select("-password -__v");
        if (!coaches || coaches.length === 0) {
            return res.status(204).json({ error: "No se encontraron entrenadores" });
        }
        res.status(200).json(coaches);
    } catch (error) {
        console.error("Error al obtener entrenadores:", error);
        res.status(404).json({ error: "Error al obtener entrenadores" });
    }
}