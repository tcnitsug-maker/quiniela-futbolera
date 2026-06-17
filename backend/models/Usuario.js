import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    puntos: {
        type: Number,
        default: 0
    },
    rol: {
        type: String,
        default: "usuario"
    }
}, {
    timestamps: true
});

export default mongoose.model("Usuario", usuarioSchema);
