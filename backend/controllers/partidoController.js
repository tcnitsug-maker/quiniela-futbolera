import Partido from "../models/Partido.js";
import Pronostico from "../models/Pronostico.js";
import Usuario from "../models/Usuario.js";

// OBTENER TODOS LOS PARTIDOS
export const obtenerPartidos = async (req, res) => {
    try {
        const partidos = await Partido.find().sort({ casillero: 1 });
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// OBTENER PARTIDOS POR CONCURSO
export const obtenerPartidosPorConcurso = async (req, res) => {
    try {
        const partidos = await Partido.find({ concursoId: req.params.concursoId }).sort({ casillero: 1 });
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// CREAR PARTIDO (Admin)
export const crearPartido = async (req, res) => {
    try {
        const partido = await Partido.create(req.body);
        res.status(201).json(partido);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// ACTUALIZAR RESULTADO Y CALIFICAR (Admin)
export const actualizarResultado = async (req, res) => {
    try {
        const { golesLocal, golesVisitante } = req.body;

        // Determinar resultado 1, X, 2
        let resultado;
        if (golesLocal > golesVisitante) resultado = "1";
        else if (golesLocal < golesVisitante) resultado = "2";
        else resultado = "X";

        const partido = await Partido.findByIdAndUpdate(
            req.params.id,
            {
                golesLocal,
                golesVisitante,
                resultado,
                estado: "finalizado"
            },
            { new: true }
        );

        // Calificar pronósticos de este partido
        const pronosticos = await Pronostico.find({ partidoId: partido._id });

        for (const p of pronosticos) {
            const acierto = p.pronostico === resultado;
            if (acierto && !p.acierto) {
                p.acierto = true;
                await p.save();
                await Usuario.findByIdAndUpdate(p.usuarioId, { $inc: { puntos: 3 } });
            }
        }

        res.json({ msg: "Resultado actualizado y pronósticos calificados", partido });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// CAMBIAR ESTADO (en_vivo, etc)
export const cambiarEstado = async (req, res) => {
    try {
        const partido = await Partido.findByIdAndUpdate(
            req.params.id,
            { estado: req.body.estado },
            { new: true }
        );
        res.json(partido);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
