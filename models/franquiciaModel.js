import mongoose from "mongoose";

const MembresiaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  fecha_pago: {
    type: Date,
    required: true
  },
  fecha_vencimiento: {
    type: Date,
    required: true
  },
  tipo_membresia: {
    type: String,
    enum: ['Visita', 'Semanal', 'Quincenal', 'Mensual'],
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  estado: { 
    type: String,
    enum: ["Activo", "Inactivo"], 
    default: "Activo"
  }
});


export const modeloMenmbresia = mongoose.model('membresia', MembresiaSchema)