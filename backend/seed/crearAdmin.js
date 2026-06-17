import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import conectarDB from "../config/db.js";
import Usuario from "../models/Usuario.js";

dotenv.config();

const crearAdmin = async () => {
    try {
        await conectarDB();

        const correo = "admin@quiniela.com";
        const existe = await Usuario.findOne({ correo });

        if (existe) {
            console.log("⚠️  El admin ya existe");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("admin123", salt);

        await Usuario.create({
            nombre: "Administrador",
            correo,
            password: passwordHash,
            rol: "admin"
        });

        console.log("✅ Admin creado");
        console.log("   Correo: admin@quiniela.com");
        console.log("   Password: admin123");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

crearAdmin();
