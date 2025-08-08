import app from "./index.js";
import conn from "./config/conexion.js";
import configuracion from "./config/configuracion.js";


conn.connect()

app.listen(configuracion.PORT || 3000,()=>{
    console.log(`Server is running on port ${configuracion.PORT || 3000}`);
})