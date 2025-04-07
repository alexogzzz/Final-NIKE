const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("usuarios", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    fecha_registro: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") 
    },
    role: { 
        type: DataTypes.STRING(100), 
        allowNull: true // ⚠ En la BD no es NOT NULL, así que lo hacemos opcional
    }
}, {
    tableName: "usuarios", // Importante si la tabla ya existe en la BD
    timestamps: false // Evita que Sequelize cree automáticamente createdAt y updatedAt
});

module.exports = User;
