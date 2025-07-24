import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const actualizarUsuario = async (req, res) => {
  try {
    const userId = req.user.id;
    const { telefono, nombre, correo, password } = req.body;

    const usuario = await userModel.findById(userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Validaciones antes de actualizar
    if (telefono !== undefined) {
      if (!telefono.trim()) return res.status(400).json({ error: "Teléfono no puede estar vacío" });
      usuario.telefono = telefono.trim();
    }

    if (nombre !== undefined) {
      if (!nombre.trim()) return res.status(400).json({ error: "Nombre no puede estar vacío" });
      usuario.nombre = nombre.trim();
    }

    if (correo !== undefined) {
      if (!correo.trim()) return res.status(400).json({ error: "Correo no puede estar vacío" });

      const existe = await userModel.findOne({ correo: correo.trim() });
      if (existe && existe._id.toString() !== userId) {
        return res.status(400).json({ error: "El correo ya está registrado por otro usuario" });
      }

      usuario.correo = correo.trim();
    }

    if (password !== undefined) {
      if (!password.trim()) return res.status(400).json({ error: "La contraseña no puede estar vacía" });
      usuario.password = await bcrypt.hash(password, 10);
    }

    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};
