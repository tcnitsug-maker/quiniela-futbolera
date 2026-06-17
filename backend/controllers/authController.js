import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// REGISTRO
export const registrar = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ msg: "Completa todos los campos" });
        }

        const existe = await Usuario.findOne({ correo });
        if (existe) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const usuario = await Usuario.create({
            nombre,
            correo,
            password: passwordHash
        });

        res.status(201).json({
            _id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            puntos: usuario.puntos,
            rol: usuario.rol,
            token: generarToken(usuario._id)
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            puntos: usuario.puntos,
            rol: usuario.rol,
            token: generarToken(usuario._id)
        });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// PERFIL
export const perfil = async (req, res) => {
    res.json(req.usuario);
};

// RANKING
export const ranking = async (req, res) => {
    try {
        const ranking = await Usuario.find()
            .select("nombre puntos")
            .sort({ puntos: -1 })
            .limit(100);
        res.json(ranking);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
