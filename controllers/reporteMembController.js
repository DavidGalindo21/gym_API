import PDFDocument from "pdfkit";
import fs from "fs";
import { modeloMenmbresia } from "../models/franquiciaModel.js";
import { title } from "process";

export const generarReporteMembresias = async (req, res) => {
  try {
    const membresias = await modeloMenmbresia
      .find()
      .sort({ fecha_pago: -1 })
      .populate("user", "nombre correo telefono");

    if (!membresias || membresias.length === 0) {
      return res.status(404).json({ message: "No hay membresías registradas" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_membresias.pdf");
    doc.pipe(res);

    const logoPath = "./public/images/logo.png";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 60 });
    }

    doc.fontSize(16).text("REPORTE MEMBRESÍAS", 120, 80, {
      align: "left",
    });

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleString("es-MX", {
      dateStyle: "short",
      timeStyle: "short",
    });

    doc.fontSize(10).text(`Fecha de generación: ${fechaFormateada}`, 400, 60, {
      align: "right",
    });

    doc.moveDown(6);
    let y = doc.y;
    const startX = 50;
    const rowHeight = 20;
    const pageWidth = 580;
const columns = [
  { title: "Nombre", x: 50 },
  { title: "Correo", x: 120 },
  { title: "Teléfono", x: 210 },
  { title: "Tipo", x: 290 },
  { title: "Estado", x: 340 },
  { title: "Pago", x: 400 },
  { title: "Vence", x: 460 },
  { title: "Total", x: 520 },
];


    doc.moveTo(startX, y - 5).lineTo(pageWidth, y - 5).stroke();

    doc.font('Helvetica-Bold').fontSize(12);
    for (const col of columns) {
      doc.text(col.title, col.x, y);
      doc.moveTo(col.x - 5, y - 5).lineTo(col.x - 5, y + rowHeight * (membresias.length + 1)).stroke();
    }
    doc.moveTo(columns[columns.length - 1].x + 60, y - 5)
       .lineTo(columns[columns.length - 1].x + 60, y + rowHeight * (membresias.length + 1)).stroke();

    doc.moveTo(startX, y + rowHeight - 5).lineTo(pageWidth, y + rowHeight - 5).stroke();

    y += rowHeight;
    doc.font('Helvetica').fontSize(10);

    for (const m of membresias) {
const estado = new Date(m.fecha_vencimiento) > new Date() ? "Activo" : "Inactivo";

doc.text(m.user?.nombre || "-", 50, y);
doc.text(m.user?.correo || "-", 120, y);
doc.text(m.user?.telefono || "-", 215, y);
doc.text(m.tipo_membresia, 290, y);
doc.text(estado, 340, y);
doc.text(new Date(m.fecha_pago).toLocaleDateString(), 400, y);
doc.text(new Date(m.fecha_vencimiento).toLocaleDateString(), 460, y);
doc.text(m.total.toFixed(2) || "-", 520, y);

   
      doc.moveTo(startX, y + rowHeight - 5).lineTo(pageWidth, y + rowHeight - 5).stroke();
      y += rowHeight;

    if (y > 720) {
  doc.addPage();
  y = 40;

  doc.font('Helvetica-Bold').fontSize(12);
  for (const col of columns) {
    doc.text(col.title, col.x, y);
    doc.moveTo(col.x - 5, y - 5).lineTo(col.x - 5, y + rowHeight * (membresias.length + 1)).stroke();
  }
  doc.moveTo(columns[columns.length - 1].x + 60, y - 5)
     .lineTo(columns[columns.length - 1].x + 60, y + rowHeight * (membresias.length + 1)).stroke();

  doc.moveTo(startX, y + rowHeight - 5).lineTo(pageWidth, y + rowHeight - 5).stroke();

  y += rowHeight;
  doc.font('Helvetica').fontSize(11);
}

    }

    doc.end();
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({ message: "Error al generar el reporte de membresías" });
  }
};
