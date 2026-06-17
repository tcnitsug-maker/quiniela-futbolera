import Concurso from "../models/Concurso.js";

// OBTENER TODOS
export const obtenerConcursos = async (req, res) => {
    try {
        const concursos = await Concurso.find().sort({ numero: -1 });
        res.json(concursos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// OBTENER ACTIVO
export const obtenerConcursoActivo = async (req, res) => {
    try {
        const concurso = await Concurso.findOne({ activo: true }).sort({ numero: -1 });
        res.json(concurso);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// CREAR CONCURSO (Admin)
export const crearConcurso = async (req, res) => {
    try {
        const concurso = await Concurso.create(req.body);
        res.status(201).json(concurso);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
