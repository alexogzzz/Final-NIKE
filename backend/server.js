require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Ya no es necesario body-parser

// Rutas
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/authProducts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
