const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Producto = require("../models/Productos");
require('dotenv').config();

const router = express.Router();

// Productos
// router.post("/productos", async (req, res) => {
//     try {
//         console.log("Datos recibidos:", req.body);

//         const { id, nombre, precio, descripcion, tipoProducto, productoOferta, img} = req.body; // 🔹 Aquí se cambia `username` por `name`
      
//         if (!id || !nombre || !precio || !tipoProducto) {
//             return res.status(400).json({ msg: "Todos los campos son obligatorios" });
//         }

//         let exsitente = await Producto.findOne({ where: { id } });
//         if (exsitente) {
//             return res.status(400).json({ msg: "El producto ya existe" });
//         }

    
//         res.json({ msg: "Productos creado correctamente" });
//     } catch (error) {
//         console.error("Error en el servidor:", error);
//         res.status(500).json({ msg: "Error en el servidor" });
//     }
// });

router.post("/productos", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        const { nombre, precio, descripcion, tipoProducto, productoOferta, img } = req.body;

        if (!nombre || !precio || !tipoProducto) {
            return res.status(400).json({ msg: "Todos los campos obligatorios" });
        }

        let nuevoProducto = await Producto.create({
            nombre,
            precio,
            descripcion,
            tipoProducto,
            productoOferta,
            img
        });

        res.json({ msg: "Producto creado correctamente", producto: nuevoProducto });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});












// Ruta para obtener todos los productos

router.get("/productos", async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

// Ruta para obtener un producto por ID
router.get("/productos/:id", async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

// Ruta para actualizar un producto
router.put("/productos/:id", async (req, res) => {
    try {
        const { nombre, precio, descripcion, tipoProducto, productoOferta, img } = req.body;
        const producto = await Producto.findByPk(req.params.id);

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;
        producto.descripcion = descripcion || producto.descripcion;
        producto.tipoProducto = tipoProducto || producto.tipoProducto;
        producto.productoOferta = productoOferta || producto.productoOferta;
        producto.img = img || producto.img;

        await producto.save();
        res.json({ msg: "Producto actualizado correctamente", producto });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});

// Ruta para eliminar un producto
router.delete("/productos/:id", async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        await producto.destroy();
        res.json({ msg: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
});




module.exports = router;
