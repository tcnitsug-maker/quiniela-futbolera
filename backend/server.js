import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conectarDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import partidoRoutes from "./routes/partidoRoutes.js";
import pronosticoRoutes from "./routes/pronosticoRoutes.js";
import concursoRoutes from "./routes/concursoRoutes.js";

dotenv.config();

conectarDB();

const app = express();

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "OK", api: "Quiniela Mundial 2026" });
});

app.use("/api/auth", authRoutes);
app.use("/api/partidos", partidoRoutes);
app.use("/api/pronosticos", pronosticoRoutes);
app.use("/api/concursos", concursoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
