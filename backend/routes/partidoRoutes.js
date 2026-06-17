import express from "express";
import {
    obtenerPartidos,
    obtenerPartidosPorConcurso,
    crearPartido,
    actualizarResultado,
    cambiarEstado
} from "../controllers/partidoController.js";
import { proteger, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", obtenerPartidos);
router.get("/concurso/:concursoId", obtenerPartidosPorConcurso);
router.post("/", proteger, soloAdmin, crearPartido);
router.put("/:id/resultado", proteger, soloAdmin, actualizarResultado);
router.put("/:id/estado", proteger, soloAdmin, cambiarEstado);

export default router;
