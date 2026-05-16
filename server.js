const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Configuração do Banco 
const db = mysql.createPool({
    host: 'k65y1l.h.filess.io', 
    user: 'Controle_methodpen',
    password: 'ea7d39c12221d686bbf724736cb0538c36e96618',
    database: 'Controle_methodpen',
    port: 3307, 
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

// C - CREATE: Rota para Criar uma Solicitação
app.post('/solicitacoes', (req, res) => {
    const { descricao, valor_solicitado } = req.body;
    const statusDefault = 'Pendente';
    
    // Como o seu banco exige chaves estrangeiras, usaremos IDs fixos (1) para teste.
    // Assim que tiver proponentes/beneficiários criados no banco, eles se vincularão corretamente.
    const proponente_id = 1;
    const beneficiario_id = 1;
    const evento_tipo_id = 1;

    const sql = `INSERT INTO solicitacao 
        (descricao, valor_solicitado, status, propoente_id, beneficiario_id, evento_tipo_id, data_criacao) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    db.query(sql, [descricao, valor_solicitado, statusDefault, proponente_id, beneficiario_id, evento_tipo_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao criar solicitação: " + err.message });
        }
        res.status(201).json({ msg: "Solicitação criada com sucesso!", id: result.insertId });
    });
});

// R - READ: Rota para Listar Todas as Solicitações na Tabela
app.get('/solicitacoes', (req, res) => {
    const sql = "SELECT * FROM solicitacao ORDER BY data_criacao DESC";

    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao buscar dados: " + err.message });
        }
        res.status(200).json(data); // Retorna a lista de registros encontrados
    });
});

// U - UPDATE: Rota para Editar uma Solicitação Existente
app.put('/solicitacoes/:id', (req, res) => {
    const { id } = req.params;
    const { descricao, valor_solicitado } = req.body;

    const sql = "UPDATE solicitacao SET descricao = ?, valor_solicitado = ? WHERE solicitacao_id = ?";

    db.query(sql, [descricao, valor_solicitado, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao atualizar: " + err.message });
        }
        res.status(200).json({ msg: "Solicitação atualizada com sucesso!" });
    });
});

// D - DELETE: Rota para Excluir uma Solicitação
app.delete('/solicitacoes/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM solicitacao WHERE solicitacao_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Erro ao deletar: " + err.message });
        }
        res.status(200).json({ msg: "Solicitação excluída com sucesso!" });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Patrocínios rodando na porta ${PORT}`);
});