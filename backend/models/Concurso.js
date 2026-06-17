import mongoose from "mongoose";

const concursoSchema = new mongoose.Schema({
    numero: Number,
    nombre: String,
    fechaInicio: Date,
    fechaFin: Date,
    activo: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Concurso", concursoSchema);
