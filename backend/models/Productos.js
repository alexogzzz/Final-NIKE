const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define("productos", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    precio: { 
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    descripcion: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    tipoProducto: { 
        type: DataTypes.ENUM("zapato", "Ropa", "Hogar", "Alimentos", "Otros"), // 🔹 ENUM en Sequelize
        allowNull: false
    },
    productoOferta: { 
        type: DataTypes.STRING(100), 
        allowNull: true // ⚠ En la BD no es NOT NULL, así que lo hacemos opcional
    },
    img: { 
        type: DataTypes.STRING(100), 
        allowNull: true // ⚠ En la BD no es NOT NULL, así que lo hacemos opcional
    }
}, {
    tableName: "productos", // Importante si la tabla ya existe en la BD
    timestamps: false // Evita que Sequelize cree automáticamente createdAt y updatedAt
});

module.exports = Producto;
