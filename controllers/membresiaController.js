import { userModel } from "../models/userModel.js";
import { modeloMenmbresia } from "../models/franquiciaModel.js";

export const insertMembresia = async (req, res) => {
  try {
    const {
      nombreCliente,
      email,
      telefono,
      fecha_pago,
      tipo_membresia,
      total,
    } = req.body;

    const usuario = await userModel.findOne({ correo: email });

    if (!usuario) {
      return res.status(204).json({
        success: false,
        message: "Usuario no encontrado con ese correo.",
      });
    }

    // Calcular fecha de vencimiento automáticamente
    const fechaPago = new Date(fecha_pago);
    let fechaVencimiento = new Date(fechaPago);

    switch (tipo_membresia) {
      case "Visita":
        fechaVencimiento.setHours(fechaVencimiento.getHours() + 24);
        break;
      case "Semanal":
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
        break;
      case "Quincenal":
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 15);
        break;
      case "Mensual":
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Tipo de membresía inválido.",
        });
    }

    const nuevaMembresia = new modeloMenmbresia({
      user: usuario._id,
      nombreCliente,
      email,
      telefono,
      fecha_pago: fechaPago,
      fecha_vencimiento: fechaVencimiento,
      tipo_membresia,
      total,
    });

    await nuevaMembresia.save();

    return res.status(200).json({
      success: true,
      message: "Membresía registrada correctamente.",
      membresia: nuevaMembresia,
    });
  } catch (error) {
    console.error("Error al registrar membresía:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

export const getMembresias = async (req, res) => {
  try {
    const membresias = await modeloMenmbresia.find().sort({ $natural: -1 });
    if (!membresias)
      return res
        .status(204)
        .json({ success: false, message: "No hay membresías registradas" });

    return res.status(200).json({
      success: true,
      message: "Membresías encontradas",
      membresias,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

export const eliminarMembresia = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar membresias" });
    }

    const { key, value } = req.params;

    const camposPermitidos = ["correo", "_id"];
    if (!camposPermitidos.includes(key)) {
      return res
        .status(400)
        .json({ error: "Campo de búsqueda no permitido" });
    }

    const query = {};
    query[key] = value;

    const usuario = await modeloMenmbresia.findOne(query);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await modeloMenmbresia.deleteOne({ _id: usuario._id });

    res.status(200).json({
      message: `Membresía de ${usuario.nombreCliente} eliminada correctamente`,
    });
  } catch (error) {
    console.error("Error al eliminar la membresía:", error);
    res.status(500).json({ error: "Error al eliminar la membresía" });
  }
};
