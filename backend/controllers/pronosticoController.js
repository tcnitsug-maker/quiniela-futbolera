import Pronostico from "../models/Pronostico.js";
import Partido from "../models/Partido.js";
import crypto from "crypto";

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

        // Si existe y está bloqueado, rechazar el cambio
        if (existente && existente.status === "locked") {
            return res.status(403).json({ 
                msg: "Este pronóstico está bloqueado. No se pueden hacer cambios después de confirmar." 
            });
        }

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

// BLOQUEAR TODOS LOS PRONÓSTICOS DEL USUARIO
export const lockPredictions = async (req, res) => {
    try {
        const usuarioId = req.usuario._id;

        // Obtener todos los pronósticos del usuario
        const pronosticos = await Pronostico.find({ usuarioId });

        if (pronosticos.length === 0) {
            return res.status(400).json({ msg: "No hay pronósticos para bloquear" });
        }

        // Bloquear cada pronóstico y generar hash de integridad
        const now = new Date();
        for (let p of pronosticos) {
            // Generar hash SHA-256 del pronóstico
            const hash = crypto
                .createHash("sha256")
                .update(JSON.stringify({ 
                    usuarioId: p.usuarioId.toString(), 
                    partidoId: p.partidoId.toString(), 
                    pronostico: p.pronostico 
                }))
                .digest("hex");

            p.status = "locked";
            p.locked_at = now;
            p.lockedHash = hash;
            await p.save();
        }

        res.json({ 
            msg: "Todos los pronósticos han sido bloqueados", 
            bloqueados: pronosticos.length,
            timestamp: now
        });
    } catch (error) {
        console.error(error);
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
                acierto: p.acierto,
                status: p.status,
                locked_at: p.locked_at
            };
        });

        const totalPronosticos = detalle.length;
        const aciertos = detalle.filter(d => d.acierto).length;
        const bloqueados = detalle.filter(d => d.status === "locked").length;

        res.json({
            usuario: {
                nombre: req.usuario.nombre,
                puntos: req.usuario.puntos
            },
            totalPronosticos,
            aciertos,
            bloqueados,
            pronosticos: detalle
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
