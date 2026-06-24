import dotenv from "dotenv";
import mongoose from "mongoose";
import conectarDB from "../config/db.js";
import Usuario from "../models/Usuario.js";
import Pronostico from "../models/Pronostico.js";

dotenv.config();

const seed = async () => {
  try {
    await conectarDB();

    console.log("🔄 Recalculando puntos...\n");

    // Obtener todos los usuarios
    const usuarios = await Usuario.find();

    for (let usuario of usuarios) {
      // Contar aciertos de este usuario
      const aciertos = await Pronostico.countDocuments({
        usuarioId: usuario._id,
        acierto: true
      });

      // Actualizar puntos = cantidad de aciertos
      await Usuario.findByIdAndUpdate(
        usuario._id,
        { puntos: aciertos }
      );

      console.log(`✅ ${usuario.nombre}: ${aciertos} puntos`);
    }

    // Mostrar ranking final
    const ranking = await Usuario.find().sort({ puntos: -1 });
    console.log("\n🏆 Ranking Recalculado:");
    ranking.forEach((u, i) => {
      console.log(`${i + 1}. ${u.nombre} - ${u.puntos} pts`);
    });

    console.log("\n🎉 Puntos recalculados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seed();
