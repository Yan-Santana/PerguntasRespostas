const sequelize = require("sequelize");

const conection = new sequelize('guiaperguntas', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // tira a parte de mostrar o comando sql no terminal
});

module.exports = conection;