const sequelize = require("sequelize");
const conection = require("./database");

// Relacionamento "CRU" (simples)
const Resposta = conection.define("respostas", {
    corpo: {
        type: sequelize.TEXT,
        allowNull: false // Não permite que o campo fique vazio
    },
    perguntaId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({force: false});

module.exports = Resposta;