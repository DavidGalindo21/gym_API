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
  correo: {
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
  tipo_membresia: {
    type: String,
    enum: ['Basica', 'Golden', 'Premium'],
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