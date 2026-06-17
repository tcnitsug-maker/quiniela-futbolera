import Pronostico from "../models/Pronostico.js";
import Partido from "../models/Partido.js";

// GUARDAR / ACTUALIZAR PRONÓSTICO
export const guardarPronostico = async (req, res) => {
    try {
        const { partidoId, pronostico } = req.body;
        const usuarioId = req.usuario._id;

        // Validar que el partido siga pendiente
        const partido = await Partido.findById(partidoId);
        if (!partido) {
            return res.status(404).json({ msg: "Partido no encontrado" });
        }
        if (partido.estado !== "pendiente") {
            return res.status(403).json({ msg: "El partido ya comenzó, no se aceptan pronósticos" });
        }

        const existente = await Pronostico.findOne({ usuarioId, partidoId });

        if (existente) {
            existente.pronostico = pronostico;
            await existente.save();
            return res.json({ msg: "Pronóstico actualizado", pronostico: existente });
        }

        const nuevo = await Pronostico.create({ usuarioId, partidoId, pronostico });
        res.status(201).json({ msg: "Pronóstico guardado", pronostico: nuevo });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// OBTENER MIS PRONÓSTICOS
export const misPronosticos = async (req, res) => {
    try {
        const pronosticos = await Pronostico.find({ usuarioId: req.usuario._id })
            .populate("partidoId");
        res.json(pronosticos);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// DASHBOARD DEL USUARIO
export const dashboard = async (req, res) => {
    try {
        const pronosticos = await Pronostico.find({ usuarioId: req.usuario._id })
            .populate("partidoId");

        const detalle = pronosticos.map(p => {
            const partido = p.partidoId;
            return {
                local: partido.local,
                visitante: partido.visitante,
                logoLocal: partido.logoLocal,
                logoVisitante: partido.logoVisitante,
                tuPronostico: p.pronostico,
                resultado: partido.resultado || "Pendiente",
                marcador: partido.golesLocal !== null
                    ? `${partido.golesLocal}-${partido.golesVisitante}`
                    : "-",
                estado: partido.estado,
                acierto: p.acierto
            };
        });

        const totalPronosticos = detalle.length;
        const aciertos = detalle.filter(d => d.acierto).length;

        res.json({
            usuario: {
                nombre: req.usuario.nombre,
                puntos: req.usuario.puntos
            },
            totalPronosticos,
            aciertos,
            pronosticos: detalle
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
