import mongoose from "mongoose";

const MembresiaSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreCliente:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
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
  }
});

export const modeloMenmbresia = mongoose.model('membresia', MembresiaSchema)