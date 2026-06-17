import mongoose from "mongoose";

const partidoSchema = new mongoose.Schema({
    concursoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concurso"
    },
    casillero: Number,
    local: String,
    visitante: String,
    logoLocal: String,
    logoVisitante: String,
    fecha: Date,
    estado: {
        type: String,
        default: "pendiente"
    },
    resultado: {
        type: String,
        default: ""
    },
    golesLocal: {
        type: Number,
        default: null
    },
    golesVisitante: {
        type: Number,
        default: null
    }
});

export default mongoose.model("Partido", partidoSchema);
