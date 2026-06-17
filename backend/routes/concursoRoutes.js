import express from "express";
import {
    obtenerConcursos,
    obtenerConcursoActivo,
    crearConcurso
} from "../controllers/concursoController.js";
import { proteger, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", obtenerConcursos);
router.get("/activo", obtenerConcursoActivo);
router.post("/", proteger, soloAdmin, crearConcurso);

export default router;
