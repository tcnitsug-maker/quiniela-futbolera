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

// Recalcula los puntos de TODOS los usuarios desde cero,
// basándose en los pronósticos acertados de partidos finalizados.
async function recalcularTodo() {
    // Resetear puntos y aciertos de todos
    await Usuario.updateMany({}, { puntos: 0, aciertos: 0 });

    const finalizados = await Partido.find({ estado: "finalizado" });
    const mapaResultado = {};
    finalizados.forEach((p) => { mapaResultado[p._id.toString()] = p.resultado; });

    const pronosticos = await Pronostico.find();

    // Acumular aciertos por usuario
    const acumulado = {}; // usuarioId -> aciertos
    for (const p of pronosticos) {
        const resultadoReal = mapaResultado[p.partidoId?.toString()];
        const acierto = resultadoReal && p.pronostico === resultadoReal;
        p.acierto = !!acierto;
        await p.save();
        if (acierto) {
            const id = p.usuarioId.toString();
            acumulado[id] = (acumulado[id] || 0) + 1;
        }
    }

    // Aplicar: 3 puntos por acierto
    for (const [usuarioId, aciertos] of Object.entries(acumulado)) {
        await Usuario.findByIdAndUpdate(usuarioId, {
            puntos: aciertos * 3,
            aciertos: aciertos
        });
    }
}

// ESTABLECER RESULTADO DIRECTO 1/X/2 Y CALIFICAR (Admin)
export const establecerResultado = async (req, res) => {
    try {
        const { resultado } = req.body; // "1", "X", "2"

        if (!["1", "X", "2"].includes(resultado)) {
            return res.status(400).json({ msg: "Resultado inválido. Usa 1, X o 2" });
        }

        await Partido.findByIdAndUpdate(req.params.id, {
            resultado,
            estado: "finalizado"
        });

        // Recalcular puntos de todos (maneja correcciones también)
        await recalcularTodo();

        res.json({ msg: "Resultado guardado y puntos recalculados" });
    } catch (error) {
        res.status(500).json({ msg: "Error al guardar el resultado" });
    }
};

// LIMPIAR RESULTADO (volver a pendiente) Y RECALCULAR (Admin)
export const limpiarResultado = async (req, res) => {
    try {
        await Partido.findByIdAndUpdate(req.params.id, {
            resultado: "",
            estado: "pendiente"
        });
        await recalcularTodo();
        res.json({ msg: "Resultado eliminado y puntos recalculados" });
    } catch (error) {
        res.status(500).json({ msg: "Error al limpiar el resultado" });
    }
};

// CAMBIAR ESTADO (en_vivo, etc) (Admin)
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
