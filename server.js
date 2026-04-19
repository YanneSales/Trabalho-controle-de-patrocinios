const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Configuração do Banco da Yanne (Filess.io)
const db = mysql.createPool({
    host: 'k65y1l.h.filess.io', 
    user: 'Controle_methodpen',
    password: 'ea7d39c12221d686bbf724736cb0538c36e96618',
    database: 'Controle_methodpen',
    port: 3307, // Ela deve testar 3307 ou 3306
    waitForConnections: true,
    connectionLimit: 5, // Limite exato do Filess.io
    queueLimit: 0
});


console.log("Pool de conexões configurado!");

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const { nome, login, senha } = req.body; // Certifique-se de usar 'login' aqui
    
    // Use 'usuarios' minúsculo e 'login' como nome da coluna
    const sql = "INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?)";
    
    db.query(sql, [nome, login, senha], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro no banco: " + err.message });
        }
        res.status(200).json({ msg: "Usuário gravado com sucesso!" });
    });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?";

    db.query(sql, [login, senha], (err, data) => {
        if (err) {
            return res.status(500).json({ msg: "Erro no banco: " + err.message });
        }
        if (data.length > 0) {
            res.status(200).json({ msg: "Login realizado!" });
        } else {
            res.status(401).json({ msg: "Credenciais inválidas" });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Patrocínios rodando na porta ${PORT}`);
});