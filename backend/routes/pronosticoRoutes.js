import express from "express";
import {
    guardarPronostico,
    misPronosticos,
    dashboard
} from "../controllers/pronosticoController.js";
import { proteger } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", proteger, guardarPronostico);
router.get("/mios", proteger, misPronosticos);
router.get("/dashboard", proteger, dashboard);

export default router;
