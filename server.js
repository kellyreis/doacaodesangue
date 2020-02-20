//configurando o servidor
const express = require("express");
const server = express();


//configurar o servidor para apresentar,
//arquivos estasticos: css,img,js
server.use(express.static('public'))

//Habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//Configurar banco de dados
const poll = require('pg').Pool
const db = new poll({
    user: "root",
    password: "",
    host: "localhost",
    port: 5423,
    database: 'doe',
})


//configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//lista de adoadores
//Vetor ou Array 



//Post dados do forms

//configurar a apresentação da página
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("erro no banco de dados")
        const donors = result.rows

        return res.render("index.html", { donors });
    })


});


server.post("/", function(req, res) {
    //Pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    //verifica se os campos estão preenchidos
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }


    //coloco valores dentro do banco de dados
    const query = `INSERT INTO  donors ("name","email","blood") 
        VALUES ($1,$2,$3,$4) `

    const values = [name, email, blood]
    db.query(query, values, function(err) {
        if (err) return res.send("erro no banco de dados")
        return res.redirect("/")

    })



})

//Ligar o servidor, e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciar o servidor");
});