const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o site acesse o servidor

// 🔗 CONEXÃO COM FILESS.IO
const db = mysql.createConnection({
    host: 'k65y1l.h.filess.io', 
    user: 'Controle_methodpen',
    password: 'ea7d39c12221d686bbf724736cb0538c36e96618',
    database: 'Controle_methodpen',
    port: 3307 
});

db.connect(err => {
    if (err) return console.error("Erro ao conectar no banco:", err);
    console.log("Conectado ao banco de dados com sucesso!");
});

// ROTA DE LOGIN
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(404).send({ mensagem: "Usuário não cadastrado!" });
        }

        const usuario = results[0];
        if (usuario.senha !== senha) {
            return res.status(401).send({ mensagem: "Senha incorreta!" });
        }

        res.send({ mensagem: "Login realizado com sucesso!" });
    });
});

// ROTA DE CADASTRO
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).send({ mensagem: "E-mail já cadastrado!" });
            return res.status(500).send(err);
        }
        res.send({ mensagem: "Cadastro realizado com sucesso!" });
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));