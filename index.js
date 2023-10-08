const express = require('express'); // Importando o modulo
const app = express(); // Iniciando o express
const bodyParser = require("body-parser");
const conection = require("./database/database"); // Importando o modulo de conexão com o banco de dados
const pergunta = require("./database/pergunta"); // Importando o modulo de perguntas
const Resposta = require("./database/RespostaModel");

// Conexão com o banco de dados
conection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });


// Definindo o EJS como renderizador de HTML
app.set("view engine", "ejs");
app.use(express.static("public")); // Variavel para usar arquivos estaticos(HTML, CSS, JS)

// Comando para permitir que a aplicação leia dados de formulários
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


 // Definindo as rotas e retornando o HTML
app.get("/", (req, res) => {
    // dentro do findAll vamos passar um Json
    pergunta.findAll({ raw: true, order:[
        ["id", "DESC"] // Coloca as perguntas em ordem decrescente
    ] }).then(perguntas => { // Mesma coisa que SELECT * FROM perguntas
        console.log(perguntas);
        res.render("index.ejs", {
            perguntas: perguntas
        });
    });
});  

app.get("/perguntar", (req, res) => {
    res.render("perguntar.ejs");
})

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    pergunta.create({ // Mesma coisa que INSERT INTO
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    }); 
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    pergunta.findOne({
        where: {id: id} // Mesma coisa que SELECT * FROM perguntas WHERE id = id
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ["id", "DESC"]
                ]
            }).then(respostas => { // Recebe as respostas como Array
                res.render("pergunta.ejs", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{ // pergunta não encontrada
            res.redirect("/");
        }
    });
});

// Salvar as respostas
app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("pergunta/"+ perguntaId);
    });
});

app.listen(8080, () =>{console.log("Rodando na porta 8080");});

