import mongoose from "mongoose";

const pronosticoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    partidoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partido"
    },
    pronostico: String,
    acierto: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("Pronostico", pronosticoSchema);
