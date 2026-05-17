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

// Middleware para garantir que o banco está vivo antes de processar rotas
app.use((req, res, next) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Erro crítico de conexão com o banco:", err.message);
            return res.status(500).json({ msg: "Banco de dados inacessível no momento. Tente novamente." });
        }
        connection.release(); // Libera a conexão de volta para o pool
        next();
    });
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

// READ: Listar todas as pessoas cadastradas (Usado na engrenagem)
app.get('/pessoas', (req, res) => {
    const sql = "SELECT * FROM pessoas ORDER BY nome ASC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json(data);
    });
});

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

// CREATE: Cadastrar Nova Pessoa
app.post('/pessoas', (req, res) => {
    const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
    const sql = "INSERT INTO pessoas (nome, cpf, nascimento, telefone, pessoa_tipo_id) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [nome, cpf, nascimento, telefone, pessoa_tipo_id], (err, result) => {
        if (err) return res.status(500).json({ msg: "Erro ao criar cadastro: " + err.message });
        res.status(201).json({ msg: "Cadastrado!", id: result.insertId });
    });
});

// UPDATE: Atualizar cadastro da pessoa
app.put('/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, telefone, pessoa_tipo_id } = req.body;
    const sql = "UPDATE pessoas SET nome = ?, telefone = ?, pessoa_tipo_id = ? WHERE pessoa_id = ?";

    db.query(sql, [nome, telefone, pessoa_tipo_id, id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Usuário atualizado com sucesso!" });
    });
});

// DELETE: Remover pessoa do sistema
app.delete('/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM pessoas WHERE pessoa_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Usuário removido com sucesso!" });
    });
});


// ================= ROTAS DE SOLICITAÇÃO =================

// C - CREATE: Criando solicitação na tabela 'solicitacao' com status em maiúsculo 'CRIADA'
app.post('/solicitacao', (req, res) => {
    const { descricao, valor_solicitado, proponente_id, evento_tipo_id } = req.body;
    
    // Ajustado para bater exatamente com os ENUMs e nomes das colunas do seu banco de dados
    const statusDefault = 'CRIADA'; 
    const beneficiario_id = 1; 

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
    const { descricao, valor_solicitado, evento_tipo_id } = req.body;
    const sql = "UPDATE solicitacao SET descricao = ?, valor_solicitado = ?, evento_tipo_id = ? WHERE solicitacao_id = ?";

    db.query(sql, [descricao, valor_solicitado, evento_tipo_id, id], (err, result) => {
        if (err) return res.status(500).json({ msg: err.message });
        res.status(200).json({ msg: "Atualizada com sucesso!" });
    });
});

// PATCH - AVALIAR STATUS
app.patch('/solicitacao/avaliar/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    
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
app.listen(PORT, () => console.log(`Servidor rodando com sucesso na porta ${PORT}`));