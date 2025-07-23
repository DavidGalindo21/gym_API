import mongoose from "mongoose";
import configuracion from "./configuracion.js";

const conexion = {
    connection: null, // corregido el nombre
    connect: async function() {
        if (this.connection) return this.connection;
        try {
            const conn = await mongoose.connect(configuracion.DB);
            this.connection = conn;
            console.log("Conexión a la base de datos establecida");
            return conn;
        } catch (error) {
            console.error("Error al conectar a la base de datos:", error);
            throw error;
        }
    }
};

export default conexion;