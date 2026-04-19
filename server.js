const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// --- CONFIGURAÇÃO DO BANCO FILERSS.IO ---
const db = mysql.createConnection({
    host: 'k65y1l.h.filess.io', 
    user: 'Controle_methodpen',
    password: 'ea7d39c12221d686bbf724736cb0538c36e96618',
    database: 'Controle_methodpen',
    port: 3307 
});

db.connect(err => {
    if (err) return console.error("Erro ao conectar no Filess:", err);
    console.log("Banco de dados conectado!");
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err) => {
        if (err) return res.status(500).json({ mensagem: "Erro ao cadastrar ou e-mail já existe." });
        res.json({ mensagem: "Cadastro realizado com sucesso!" });
    });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ mensagem: "Erro no servidor." });
        
        if (results.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não cadastrado! Por favor, cadastre-se." });
        }

        if (results[0].senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta." });
        }

        res.json({ mensagem: "Login realizado com sucesso!" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));