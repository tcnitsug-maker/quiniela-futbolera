import dotenv from "dotenv";
import mongoose from "mongoose";
import conectarDB from "../config/db.js";
import Concurso from "../models/Concurso.js";
import Partido from "../models/Partido.js";
import Pronostico from "../models/Pronostico.js";
import Usuario from "../models/Usuario.js";

dotenv.config();

const f = (code) => `https://flagcdn.com/w320/${code}.png`;

const partidos = [
  { casillero: 1,  local: "Suiza",          visitante: "Canadá",          logoLocal: f("ch"),     logoVisitante: f("ca") },
  { casillero: 2,  local: "Escocia",        visitante: "Brasil",          logoLocal: f("gb-sct"), logoVisitante: f("br") },
  { casillero: 3,  local: "Turquía",        visitante: "México",          logoLocal: f("tr"),     logoVisitante: f("mx") },
  { casillero: 4,  local: "Chile",          visitante: "Paraguay",        logoLocal: f("cl"),     logoVisitante: f("py") },
  { casillero: 5,  local: "Sudáfrica",      visitante: "Corea del Sur",   logoLocal: f("za"),     logoVisitante: f("kr") },
  { casillero: 6,  local: "Ecuador",        visitante: "Alemania",        logoLocal: f("ec"),     logoVisitante: f("de") },
  { casillero: 7,  local: "Japón",          visitante: "Suecia",          logoLocal: f("jp"),     logoVisitante: f("se") },
  { casillero: 8,  local: "Túnez",          visitante: "Costa Rica",      logoLocal: f("tn"),     logoVisitante: f("cr") },
  { casillero: 9,  local: "Arabia Saudita", visitante: "E.U.A.",          logoLocal: f("sa"),     logoVisitante: f("us") },
  { casillero: 10, local: "Irán",           visitante: "México",          logoLocal: f("ir"),     logoVisitante: f("mx") },
  { casillero: 11, local: "Uruguay",        visitante: "México",          logoLocal: f("uy"),     logoVisitante: f("mx") },
  { casillero: 12, local: "Australia",      visitante: "Francia",         logoLocal: f("au"),     logoVisitante: f("fr") },
  { casillero: 13, local: "Croacia",        visitante: "Argentina",       logoLocal: f("hr"),     logoVisitante: f("ar") },
  { casillero: 14, local: "Bélgica",        visitante: "Francia",         logoLocal: f("be"),     logoVisitante: f("fr") },
  { casillero: 15, local: "Uruguay",        visitante: "Francia",         logoLocal: f("uy"),     logoVisitante: f("fr") },
  { casillero: 16, local: "Honduras",       visitante: "Francia",         logoLocal: f("hn"),     logoVisitante: f("fr") },
  { casillero: 17, local: "Senegal",        visitante: "Egipto",          logoLocal: f("sn"),     logoVisitante: f("eg") },
  { casillero: 18, local: "Túnez",          visitante: "Francia",         logoLocal: f("tn"),     logoVisitante: f("fr") },
  { casillero: 19, local: "Grecia",         visitante: "España",          logoLocal: f("gr"),     logoVisitante: f("es") },
  { casillero: 20, local: "Islandia",       visitante: "Irán",            logoLocal: f("is"),     logoVisitante: f("ir") },
  { casillero: 21, local: "Palestina",      visitante: "Arabia Saudita",  logoLocal: f("ps"),     logoVisitante: f("sa") },
  { casillero: 22, local: "Jordania",       visitante: "Francia",         logoLocal: f("jo"),     logoVisitante: f("fr") },
  { casillero: 23, local: "Bolivia",        visitante: "Egipto",          logoLocal: f("bo"),     logoVisitante: f("eg") }
];

const seed = async () => {
  try {
    await conectarDB();

    // Limpiar datos previos
    await Concurso.deleteMany({});
    await Partido.deleteMany({});
    await Pronostico.deleteMany({});
    await Usuario.updateMany({}, { puntos: 0, aciertos: 0 });
    console.log("🧹 Datos previos eliminados");

    const concurso = await Concurso.create({
      numero: 2338,
      nombre: "Concurso 2338 - Mundial 2026",
      fechaInicio: new Date("2026-06-18"),
      fechaFin: new Date("2026-07-19"),
      activo: true
    });
    console.log("✅ Concurso 2338 creado");

    const partidosConConcurso = partidos.map((p) => ({
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
