import Routine from "../models/routineModel.js";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { modeloMenmbresia } from "../models/franquiciaModel.js";
import path from "path"
import fs from "fs"


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
      usuario.password = password
    }

    // Guardar cambios
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

export const descargarRutina = async(req,res) => {

  try {
    const {id} = req.params;

    const rutina = await Routine.findById(id)
    if(!rutina) return res.status(204).json({error: "Rutina no encontrada"})

      const filepath = path.join(process.cwd(), rutina.filepath)
      if(!fs.existsSync(filepath)) return res.status(204).json({error: "Archivo no encontrado"})

      res.download(filepath,rutina.filename,(err)=>{
        if(err) return res.status(500).json({error: "Error al descargar el archivo"})
      })

  } catch (error) {
    res.status(500).json({error:"Error interno del servidor"})
  }

}