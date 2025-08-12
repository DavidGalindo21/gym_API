import PDFDocument from "pdfkit";
import { userModel } from "../models/userModel.js";
import { modeloMenmbresia } from "../models/franquiciaModel.js";
import fs from "fs";

export const generarReporteClientes = async (req, res) => {
  try {
    const clientes = await userModel.find({ rol: "user" });

    if (!clientes || clientes.length === 0) {
      return res.status(404).json({ message: "No hay clientes registrados" });
    }

    // Establecer cabeceras para forzar descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=\"reporte_clientes.pdf\"");

    // Crear documento PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res); // Redirigir la salida al response

    // Logo si existe
    const logoPath = "./public/images/logo.png";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 60 });
    }

    doc.fontSize(16).text("REPORTE CLIENTES", 120, 80, { align: "left" });

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });

    doc.fontSize(10).text(`Fecha de generación: ${fechaFormateada}`, 400, 60, {
      align: "right",
    });

    // Encabezados de tabla
    doc.moveDown(6);
    let y = doc.y;
    const startX = 50;
    const rowHeight = 20;
    const pageWidth = 550;
    const columns = [
      { title: "Nombre", x: 50, width: 100 },
      { title: "Correo", x: 150, width: 120 },
      { title: "Teléfono", x: 270, width: 100 },
      { title: "Membresía", x: 380, width: 100 },
      { title: "Estado", x: 480, width: 80 },
    ];

    doc.moveTo(startX, y - 5).lineTo(pageWidth, y - 5).stroke();
    doc.font('Helvetica-Bold').fontSize(12);

    for (const col of columns) {
      doc.text(col.title, col.x, y);
      doc.moveTo(col.x - 5, y - 5).lineTo(col.x - 5, y + rowHeight * (clientes.length + 1)).stroke();
    }

    doc.moveTo(columns[columns.length - 1].x + columns[columns.length - 1].width - 5, y - 5)
       .lineTo(columns[columns.length - 1].x + columns[columns.length - 1].width - 5, y + rowHeight * (clientes.length + 1))
       .stroke();

    doc.moveTo(startX, y + rowHeight - 5).lineTo(pageWidth, y + rowHeight - 5).stroke();

    y += rowHeight;
    doc.font('Helvetica').fontSize(10);

for (const cliente of clientes) {
  const membresia = await modeloMenmbresia
    .findOne({ user: cliente._id })
    .sort({ fecha_pago: -1 });

  let tipoMembresia = "-";
  let estado = "Sin membresía";

  if (membresia) {
    const hoy = new Date();
    estado = new Date(membresia.fecha_vencimiento) > hoy ? "Activo" : "Inactivo";
    tipoMembresia = membresia.tipo_membresia;
  }

  doc.text(cliente.nombre || "-", 50, y);
  doc.text(cliente.correo || "-", 150, y);
  doc.text(cliente.telefono || "-", 270, y);
  doc.text(tipoMembresia, 380, y);
  doc.text(estado, 480, y);

      doc.moveTo(startX, y + rowHeight - 5).lineTo(pageWidth, y + rowHeight - 5).stroke();
      y += rowHeight;

      if (y > 720) {
        doc.addPage();
        y = 40;
      }
    }

    doc.end(); // Finaliza el documento y envía al cliente

  } catch (error) {
    console.error("Error al generar reporte:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error al generar el reporte de clientes" });
    }
  }
};
