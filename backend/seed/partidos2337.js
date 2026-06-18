import dotenv from "dotenv";
import mongoose from "mongoose";
import conectarDB from "../config/db.js";
import Concurso from "../models/Concurso.js";
import Partido from "../models/Partido.js";
import Pronostico from "../models/Pronostico.js";
import Usuario from "../models/Usuario.js";

dotenv.config();

// Logos por bandera (flagcdn). Para selecciones sin código ISO simple usamos el más cercano.
const f = (code) => `https://flagcdn.com/w320/${code}.png`;

const partidos = [
  { casillero: 1,  local: "Chequia",        visitante: "Sudáfrica",       logoLocal: f("cz"),     logoVisitante: f("za") },
  { casillero: 2,  local: "Suiza",          visitante: "Bosnia",          logoLocal: f("ch"),     logoVisitante: f("ba") },
  { casillero: 3,  local: "Canadá",         visitante: "Catar",           logoLocal: f("ca"),     logoVisitante: f("qa") },
  { casillero: 4,  local: "México",         visitante: "Rep. de Corea",   logoLocal: f("mx"),     logoVisitante: f("kr") },
  { casillero: 5,  local: "E.U.A.",         visitante: "Australia",       logoLocal: f("us"),     logoVisitante: f("au") },
  { casillero: 6,  local: "Escocia",        visitante: "Marruecos",       logoLocal: f("gb-sct"), logoVisitante: f("ma") },
  { casillero: 7,  local: "Brasil",         visitante: "Haití",           logoLocal: f("br"),     logoVisitante: f("ht") },
  { casillero: 8,  local: "Turquía",        visitante: "Paraguay",        logoLocal: f("tr"),     logoVisitante: f("py") },
  { casillero: 9,  local: "Países Bajos",   visitante: "Suecia",          logoLocal: f("nl"),     logoVisitante: f("se") },
  { casillero: 10, local: "Alemania",       visitante: "Costa de Marfil", logoLocal: f("de"),     logoVisitante: f("ci") },
  { casillero: 11, local: "Ecuador",        visitante: "Curazao",         logoLocal: f("ec"),     logoVisitante: f("cw") },
  { casillero: 12, local: "Túnez",          visitante: "Japón",           logoLocal: f("tn"),     logoVisitante: f("jp") },
  { casillero: 13, local: "España",         visitante: "Arabia Saudita",  logoLocal: f("es"),     logoVisitante: f("sa") },
  { casillero: 14, local: "Bélgica",        visitante: "Irán",            logoLocal: f("be"),     logoVisitante: f("ir") },
  { casillero: 15, local: "Uruguay",        visitante: "Cabo Verde",      logoLocal: f("uy"),     logoVisitante: f("cv") },
  { casillero: 16, local: "Australia",      visitante: "Egipto",          logoLocal: f("au"),     logoVisitante: f("eg") },
  { casillero: 17, local: "Argentina",      visitante: "Austria",         logoLocal: f("ar"),     logoVisitante: f("at") },
  { casillero: 18, local: "Francia",        visitante: "Irak",            logoLocal: f("fr"),     logoVisitante: f("iq") },
  { casillero: 19, local: "Noruega",        visitante: "Senegal",         logoLocal: f("no"),     logoVisitante: f("sn") },
  { casillero: 20, local: "Jordania",       visitante: "Argelia",         logoLocal: f("jo"),     logoVisitante: f("dz") },
  { casillero: 21, local: "Portugal",       visitante: "Honduras",        logoLocal: f("pt"),     logoVisitante: f("hn") },
  { casillero: 22, local: "Inglaterra",     visitante: "Ghana",           logoLocal: f("gb-eng"), logoVisitante: f("gh") },
  { casillero: 23, local: "Rep. del Congo", visitante: "Venezuela",       logoLocal: f("cg"),     logoVisitante: f("ve") }
];

const seed = async () => {
  try {
    await conectarDB();

    // Limpiar concursos, partidos y pronósticos previos
    await Concurso.deleteMany({});
    await Partido.deleteMany({});
    await Pronostico.deleteMany({});
    // Resetear puntos de usuarios (los pronósticos viejos ya no aplican)
    await Usuario.updateMany({}, { puntos: 0, aciertos: 0 });
    console.log("🧹 Datos previos eliminados y puntos reseteados");

    const concurso = await Concurso.create({
      numero: 2338,
      nombre: "Concurso 2338 - Mundial 2026",
      fechaInicio: new Date("2026-06-18"),
      fechaFin: new Date("2026-06-24"),
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
