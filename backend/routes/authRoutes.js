import express from "express";
import { registrar, login, perfil, ranking } from "../controllers/authController.js";
import { proteger } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registrar", registrar);
router.post("/login", login);
router.get("/perfil", proteger, perfil);
router.get("/ranking", ranking);

export default router;
