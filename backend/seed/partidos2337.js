import dotenv from "dotenv";
import mongoose from "mongoose";
import conectarDB from "../config/db.js";
import Concurso from "../models/Concurso.js";
import Partido from "../models/Partido.js";

dotenv.config();

// Logos por bandera (flagcdn)
const f = (code) => `https://flagcdn.com/w320/${code}.png`;

const partidos2337 = [
    { casillero: 1,  local: "México",        visitante: "Rep. de Corea",   logoLocal: f("mx"),     logoVisitante: f("kr") },
    { casillero: 2,  local: "Chequia",       visitante: "Sudáfrica",        logoLocal: f("cz"),     logoVisitante: f("za") },
    { casillero: 3,  local: "Suiza",         visitante: "Bosnia",           logoLocal: f("ch"),     logoVisitante: f("ba") },
    { casillero: 4,  local: "E.U.A.",        visitante: "Australia",        logoLocal: f("us"),     logoVisitante: f("au") },
    { casillero: 5,  local: "Escocia",       visitante: "Marruecos",        logoLocal: f("gb-sct"), logoVisitante: f("ma") },
    { casillero: 6,  local: "Turquía",       visitante: "Paraguay",         logoLocal: f("tr"),     logoVisitante: f("py") },
    { casillero: 7,  local: "Países Bajos",  visitante: "Suecia",           logoLocal: f("nl"),     logoVisitante: f("se") },
    { casillero: 8,  local: "Alemania",      visitante: "Costa de Marfil",  logoLocal: f("de"),     logoVisitante: f("ci") },
    { casillero: 9,  local: "Túnez",         visitante: "Japón",            logoLocal: f("tn"),     logoVisitante: f("jp") },
    { casillero: 10, local: "Nueva Zelanda", visitante: "Egipto",           logoLocal: f("nz"),     logoVisitante: f("eg") },
    { casillero: 11, local: "Argentina",     visitante: "Austria",          logoLocal: f("ar"),     logoVisitante: f("at") },
    { casillero: 12, local: "Noruega",       visitante: "Senegal",          logoLocal: f("no"),     logoVisitante: f("sn") },
    { casillero: 13, local: "Jordania",      visitante: "Argelia",          logoLocal: f("jo"),     logoVisitante: f("dz") },
    { casillero: 14, local: "Panamá",        visitante: "Croacia",          logoLocal: f("pa"),     logoVisitante: f("hr") }
];

const seed = async () => {
    try {
        await conectarDB();

        // Limpiar concursos y partidos previos
        await Concurso.deleteMany({});
        await Partido.deleteMany({});
        console.log("🧹 Datos previos eliminados");

        // Crear concurso 2337
        const concurso = await Concurso.create({
            numero: 2337,
            nombre: "Concurso 2337 - Mundial 2026",
            fechaInicio: new Date("2026-06-12"),
            fechaFin: new Date("2026-06-17T21:00:00"),
            activo: true
        });
        console.log("✅ Concurso 2337 creado");

        // Crear partidos
        const partidosConConcurso = partidos2337.map(p => ({
            ...p,
            concursoId: concurso._id,
            fecha: new Date("2026-06-18"),
            estado: "pendiente"
        }));

        await Partido.insertMany(partidosConConcurso);
        console.log(`✅ ${partidosConConcurso.length} partidos creados`);

        console.log("\n🎉 Seed completado correctamente");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error en seed:", error);
        process.exit(1);
    }
};

seed();
