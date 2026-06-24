import Partido from "../models/Partido.js";
import Usuario from "../models/Usuario.js";
import Pronostico from "../models/Pronostico.js";

export const obtenerPartidos = async (req, res) => {
    try {
        const partidos = await Partido.find();
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const obtenerPartidosPorConcurso = async (req, res) => {
    try {
        const { concursoId } = req.params;
        const partidos = await Partido.find({ concursoId });
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const crearPartido = async (req, res) => {
    try {
        const nuevoPartido = await Partido.create(req.body);
        res.status(201).json(nuevoPartido);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const establecerResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { golesLocal, golesVisitante } = req.body;

        const partido = await Partido.findByIdAndUpdate(
            id,
            {
                golesLocal,
                golesVisitante,
                estado: "finalizado",
                resultado: golesLocal > golesVisitante ? "1" : golesLocal < golesVisitante ? "2" : "X"
            },
            { new: true }
        );

        const resultadoCorreto = golesLocal > golesVisitante ? "1" : golesLocal < golesVisitante ? "2" : "X";
        const pronosticos = await Pronostico.find({ partidoId: id });

        for (let p of pronosticos) {
            if (p.pronostico === resultadoCorreto) {
                p.acierto = true;
                await Usuario.findByIdAndUpdate(p.usuarioId, { $inc: { puntos: 1 } });
            } else {
                p.acierto = false;
            }
            await p.save();
        }

        res.json({ msg: "Resultado registrado", partido });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const limpiarResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const pronosticos = await Pronostico.find({ partidoId: id });

        for (let p of pronosticos) {
            if (p.acierto) {
                await Usuario.findByIdAndUpdate(p.usuarioId, { $inc: { puntos: -1 } });
            }
        }

        await Partido.findByIdAndUpdate(id, {
            golesLocal: null,
            golesVisitante: null,
            estado: "pendiente",
            resultado: ""
        });

        await Pronostico.updateMany({ partidoId: id }, { acierto: false });

        res.json({ msg: "Resultado eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const partido = await Partido.findByIdAndUpdate(id, { estado }, { new: true });
        res.json(partido);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
