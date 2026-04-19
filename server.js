const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ Configuração do Banco da Yanne (Filess.io)
const db = mysql.createConnection({
    host: 'k65y1l.h.filess.io', 
    user: 'Controle_methodpen',
    password: 'ea7d39c12221d686bbf724736cb0538c36e96618',
    database: 'Controle_methodpen',
    port: 3307 // Ela deve testar 3307 ou 3306
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no Filess:", err);
        return;
    }
    console.log("Banco de Patrocínios conectado!");
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body; 
    // Mudamos para 'login' (coluna do banco) e 'Usuarios' (nome da tabela)
    const sql = "INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?)";
    
    db.query(sql, [nome, email, senha], (err) => {
        if (err) return res.status(500).json({ msg: "Erro no banco: " + err.message });
        res.json({ msg: "Usuário gravado com sucesso!" });
    });
});

// Rota de Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    // Mudamos para 'login' que é o nome na tabela dela
    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?";
    
    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ msg: err.message });
        
        if (results.length > 0) {
            res.json({ msg: "Login realizado!" });
        } else {
            res.status(401).json({ msg: "E-mail ou senha incorretos" });
        }
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Patrocínios rodando na porta ${PORT}`);
});