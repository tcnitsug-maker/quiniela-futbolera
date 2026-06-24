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
    },
    status: {
        type: String,
        enum: ["active", "locked"],
        default: "active"
    },
    locked_at: {
        type: Date,
        default: null
    },
    lockedHash: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("Pronostico", pronosticoSchema);
