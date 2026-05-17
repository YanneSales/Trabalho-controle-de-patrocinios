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
    const { nome, login, senha } = req.body; 
    
   
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
            return res.status(500).json({ msg: "Servidor acordando, tente novamente em alguns segundos " + err.message });
        }
        if (data.length > 0) {
            res.status(200).json({ msg: "Login realizado!" });
        } else {
            res.status(401).json({ msg: "Credenciais inválidas" });
        }
    });
});

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
    const { nome, login, senha } = req.body; 
    
   
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
            return res.status(500).json({ msg: "Servidor acordando, tente novamente em alguns segundos " + err.message });
        }
        if (data.length > 0) {
            res.status(200).json({ msg: "Login realizado!" });
        } else {
            res.status(401).json({ msg: "Credenciais inválidas" });
        }
    });
});

// ================= ROTAS DE PESSOAS / IDENTIFICAÇÃO =================

// Verificar se pessoa já existe no sistema corporativo
app.post('/pessoas/verificar', (req, res) => {
    const { nome, cpf, pessoa_tipo_id } = req.body;
    const sql = "SELECT * FROM pessoas WHERE nome = ? AND cpf = ? AND pessoa_tipo_id = ?";
    
    db.query(sql, [nome, cpf, pessoa_tipo_id], (err, data) => {
        if (err) return res.status(500).json({ msg: err.message });
        if (data.length > 0) {
            return res.status(200).json({ msg: "Acesso Liberado!", pessoa: data[0] });
        } else {
            return res.status(404).json({ msg: "Perfil não localizado." });
        }
    });
});

// Cadastrar Nova Pessoa
app.post('/pessoas', (req, res) => {
    const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
    const sql = "INSERT INTO pessoas (nome, cpf, nascimento, telefone, pessoa_tipo_id) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [nome, cpf, nascimento, telefone, pessoa_tipo_id], (err, result) => {
        if (err) return res.status(500).json({ msg: "Erro ao criar cadastro: " + err.message });
        res.status(201).json({ msg: "Cadastrado!", id: result.insertId });
    });
});


// ================= ROTAS DE SOLICITAÇÃO =================

// C - CREATE: Criando solicitação dinâmica usando o proponente_id coletado
app.post('/solicitacao', (req, res) => {
    const { descricao, valor_solicitado, proponente_id } = req.body;
    const statusDefault = 'Pendente';
    const beneficiario_id = 1; // Padrão
    const evento_tipo_id = 1;  // Padrão

    const sql = `INSERT INTO solicitacao
        (descricao, valor_solicitado, status, proponente_id, beneficiario_id, evento_tipo_id, data_criacao) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    const valores = [descricao, valor_solicitado, statusDefault, proponente_id, beneficiario_id, evento_tipo_id];

    db.query(sql, valores, (err, result) => {
        if (err) return res.status(500).json({ msg: "Erro ao criar: " + err.message });
        res.status(201).json({ msg: "Solicitação criada com sucesso!", id: result.insertId });
    });
});

// R - READ: Listar solicitações
app.get('/solicitacao', (req, res) => {
    const sql = "SELECT * FROM solicitacao ORDER BY data_criacao DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json(data);
    });
});

// U - UPDATE: Editar dados comuns
app.put('/solicitacao/:id', (req, res) => {
    const { id } = req.params;
    const { descricao, valor_solicitado } = req.body;
    const sql = "UPDATE solicitacao SET descricao = ?, valor_solicitado = ? WHERE solicitacao_id = ?";

    db.query(sql, [descricao, valor_solicitado, id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Atualizada com sucesso!" });
    });
});

// PATCH - AVALIAR STATUS OU ADICIONAR OBSERVAÇÕES (Analistas e Aprovadores)
app.patch('/solicitacao/avaliar/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    
    // Atualiza o status conforme regras do ENUM de seu Banco
    const sql = "UPDATE solicitacao SET status = ? WHERE solicitacao_id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Avaliação registrada!" });
    });
});

// D - DELETE: Deletar
app.delete('/solicitacao/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM solicitacao WHERE solicitacao_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Excluída!" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));