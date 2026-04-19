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

// --- ROTA DE CADASTRO ---
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body; // No dela usamos 'email'
    
    // Ela precisa conferir se a tabela dela chama 'usuarios' ou 'tbUsuarios'
    const sql = "INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)";
    
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao gravar no banco" });
        }
        res.status(200).json({ msg: "Usuário gravado com sucesso!" });
    });
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    
    const sql = "SELECT * FROM Usuarios WHERE email = ? AND senha = ?";
    
    db.query(sql, [email, senha], (err, data) => {
        if (err) return res.status(500).json(err);
        
        if (data.length > 0) {
            res.status(200).json({ msg: "Login realizado!", usuario: data[0] });
        } else {
            // Se não achar o usuário (404 ou 401 para redirecionar no front)
            res.status(404).json({ msg: "E-mail ou senha incorretos" });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Patrocínios rodando na porta ${PORT}`);
});