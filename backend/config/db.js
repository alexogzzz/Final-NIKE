const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});

sequelize.authenticate()
    .then(() => console.log("MySQL conectado"))
    .catch(err => console.error("Error de conexión:", err));

module.exports = sequelize;
