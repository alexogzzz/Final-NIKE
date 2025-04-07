const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require('dotenv').config();

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        const { name, email, password, role} = req.body; // 🔹 Aquí se cambia `username` por `name`
      
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ 
            nombre: name, // 🔹 Ajustamos a `nombre`, como está en la BD
            email, 
            password: hashedPassword,
            role: role

        });
    
        res.json({ msg: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});



// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

module.exports = router;
