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
    status: {
        type: String,
        enum: ["activo", "inactivo"],
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    }
})

userSchema.pre("save", function (next) {
    if (this.rol === "user" && !this.status) {
        this.status = "activo";
    }
    next();
});


export const userModel = mongoose.model("user", userSchema);