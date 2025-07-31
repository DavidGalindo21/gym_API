import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     telefono: {
        type: String,
        required: true,
        unique: true,
    },
    nombre:{
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: ["admin", "user", "coach"],
        default: "user",
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }
})


export const userModel = mongoose.model("user", userSchema);