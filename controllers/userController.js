import Routine from "../models/routineModel.js";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { modeloMenmbresia } from "../models/franquiciaModel.js";
export const actualizarUsuario = async (req, res) => {
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


export const obtenerRutinasPorUsuario = async (req, res) => {
  try {
    const studentId = req.user.id;

    const rutinas = await Routine.find({ studentId }).populate("coachId", "nombre correo");

    if (!rutinas || rutinas.length === 0) {
      return res.status(204).json({ message: "No se encontraron rutinas asignadas a este usuario" });
    }

    res.status(200).json(rutinas);
  } catch (error) {
    console.error("Error al obtener rutinas del usuario:", error);
    res.status(500).json({ error: "Error al obtener rutinas del usuario" });
  }
};

export const obtenerPerfilUsuarioConEstado = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("Buscando usuario con id:", userId);
    const usuario = await userModel.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado:", usuario);

    // Busca la membresía por el campo "user" que es ObjectId
    const membresia = await modeloMenmbresia
      .findOne({ user: userId })
      .sort({ fecha_pago: -1 });

    if (!membresia) {
      return res.status(204).json({
        error: "El usuario no tiene membresías registradas",
        uid: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        role: usuario.rol,
        estadoMembresia: "Sin membresía",
        tipoMembresia: null,
        fechaVencimiento: null,
      });
    }

    const hoy = new Date();
    const estadoMembresia = new Date(membresia.fecha_vencimiento) > hoy ? "Activo" : "Inactivo";

    res.status(200).json({
      uid: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      role: usuario.rol,
      estadoMembresia,
      tipoMembresia: membresia.tipo_membresia,
      fechaVencimiento: membresia.fecha_vencimiento,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener el perfil del usuario" });
  }
};
