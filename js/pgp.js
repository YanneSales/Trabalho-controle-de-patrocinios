const API_URL = 'https://trabalho-controle-de-patrocinios.onrender.com/solicitacao';
const BASE_URL = 'https://trabalho-controle-de-patrocinios.onrender.com';

let editandoId = null;
let pessoaLogada = null; // Armazenará os dados da pessoa conectada

document.addEventListener('DOMContentLoaded', () => {
    // Configurações das abas do Modal de Identificação
    const tabAcessar = document.getElementById('tabAcessar');
    const tabCadastrar = document.getElementById('tabCadastrar');
    const formAcessar = document.getElementById('formAcessarPessoa');
    const formCadastrarPessoa = document.getElementById('formCadastrarPessoa');

    tabAcessar.addEventListener('click', () => {
        tabAcessar.classList.add('active');
        tabCadastrar.classList.remove('active');
        formAcessar.style.display = 'block';
        formCadastrarPessoa.style.display = 'none';
    });

    tabCadastrar.addEventListener('click', () => {
        tabCadastrar.classList.add('active');
        tabAcessar.classList.remove('active');
        formCadastrarPessoa.style.display = 'block';
        formAcessar.style.display = 'none';
    });

    // --- SUBMIT: VERIFICAR/ACESSAR PESSOA EXISTENTE ---
    formAcessar.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('acessoNome').value;
        const cpf = document.getElementById('acessoCpf').value;
        const tipoId = document.getElementById('acessoTipo').value;

        try {
            const resposta = await fetch(`${BASE_URL}/pessoas/verificar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, cpf, pessoa_tipo_id: tipoId })
            });
            const resultado = await resposta.json();

            if (resposta.ok && resultado.pessoa) {
                inicializarSessaoPessoa(resultado.pessoa);
            } else {
                alert(resultado.msg || "Cadastro não encontrado. Cadastre-se na aba ao lado.");
            }
        } catch (erro) {
            alert("Erro ao conectar ao servidor.");
        }
    });

    // --- SUBMIT: CADASTRAR NOVA PESSOA ---
    formCadastrarPessoa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dadosPessoa = {
            nome: document.getElementById('cadNome').value,
            cpf: document.getElementById('cadCpf').value,
            nascimento: document.getElementById('cadNascimento').value,
            telefone: document.getElementById('cadTelefone').value,
            pessoa_tipo_id: document.getElementById('cadTipo').value
        };

        try {
            const resposta = await fetch(`${BASE_URL}/pessoas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosPessoa)
            });
            const resultado = await resposta.json();

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                dadosPessoa.pessoa_id = resultado.id;
                inicializarSessaoPessoa(dadosPessoa);
            } else {
                alert(resultado.msg);
            }
        } catch (erro) {
            alert("Erro ao salvar cadastro.");
        }
    });

    // --- SUBMIT: SALVAR SOLICITAÇÃO (PROPONENTE) ---
    const formPatrocinio = document.getElementById('formPatrocinio');
    formPatrocinio.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            descricao: document.getElementById('objetivo').value,
            valor_solicitado: document.getElementById('valor').value,
            proponente_id: pessoaLogada.pessoa_id // Vincula dinamicamente à pessoa ativa
        };

        try {
            let resposta;
            if (editandoId) {
                resposta = await fetch(`${API_URL}/${editandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            } else {
                resposta = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });
            }

            const resultado = await resposta.json();
            if (resposta.ok) {
                alert(resultado.msg);
                document.getElementById('modalPatrocinio').style.display = 'none';
                formPatrocinio.reset();
                carregarTabela();
            } else {
                alert(resultado.msg);
            }
        } catch (erro) {
            alert("Erro na requisição.");
        }
    });

    // --- SUBMIT: SALVAR AVALIAÇÃO (ANALISTA / APROVADOR) ---
    document.getElementById('formAvaliacao').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('avaliacaoId').value;
        const dadosAvaliacao = {
            status: document.getElementById('selectStatus').value,
            notas_analise: document.getElementById('notaNegociacao').value
        };

        try {
            const resposta = await fetch(`${API_URL}/avaliar/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAvaliacao)
            });
            if (resposta.ok) {
                alert("Avaliação registrada com sucesso!");
                document.getElementById('modalAvaliacao').style.display = 'none';
                carregarTabela();
            }
        } catch (e) {
            alert("Erro ao avaliar.");
        }
    });

    // Modais Close
    document.querySelector('.close-modal').onclick = () => document.getElementById('modalPatrocinio').style.display = 'none';
    document.querySelector('.close-modal-aval').onclick = () => document.getElementById('modalAvaliacao').style.display = 'none';
    
    // Engrenagem Config
    document.getElementById('btnConfig').onclick = () => {
        if(pessoaLogada && String(pessoaLogada.pessoa_tipo_id) === "2") { // 2 = PROPONENTE
            alert("Acesso permitido: Gerenciando usuários do sistema...");
        } else {
            alert("Nível de permissão insuficiente");
        }
    };

    document.getElementById('btnNovoPatrocinio').onclick = () => {
        editandoId = null;
        formPatrocinio.reset();
        document.getElementById('modalPatrocinio').style.display = 'block';
    };

    document.getElementById('btnSair').onclick = () => {
        location.reload();
    };
});

function inicializarSessaoPessoa(pessoa) {
    pessoaLogada = pessoa;
    document.getElementById('modalIdentificacao').style.display = 'none';
    
    const perfis = { "2": "PROPONENTE", "3": "ANALISTA", "4": "APROVADOR", "5": "FINANCEIRO" };
    const nomePerfil = perfis[String(pessoa.pessoa_tipo_id)] || "Desconhecido";

    // Regra do Financeiro
    if(String(pessoa.pessoa_tipo_id) === "5") {
        alert("Em criação");
        location.reload();
        return;
    }

    document.getElementById('nomeUsuario').innerText = pessoa.nome;
    document.getElementById('perfilExibido').innerText = nomePerfil;

    // Regra visual de exibição do Botão Criar Novo
    if(String(pessoa.pessoa_tipo_id) === "2") {
        document.getElementById('btnNovoPatrocinio').style.display = 'inline-block';
    }

    carregarTabela();
}

async function carregarTabela() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();
        tbody.innerHTML = '';

        if (dados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">Nenhuma solicitação cadastrada.</td></tr>`;
            return;
        }

        dados.forEach(item => {
            const tr = document.createElement('tr');
            
            // Variáveis de controle de permissão de botões
            let botoesAcao = '';
            const tipo = String(pessoaLogada.pessoa_tipo_id);

            if (tipo === "2") { // PROPONENTE
                botoesAcao = `
                    <button class="btn-edit" onclick="abrirEdicao(${item.solicitacao_id}, '${item.descricao}', ${item.valor_solicitado})"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" style="background:#e74c3c" onclick="deletarSolicitacao(${item.solicitacao_id})"><i class="fas fa-trash"></i></button>
                `;
            } else if (tipo === "3" || tipo === "4") { // ANALISTA ou APROVADOR
                botoesAcao = `
                    <button class="btn-edit" style="background:#f39c12" onclick="abrirAvaliacao(${item.solicitacao_id}, '${item.descricao}', '${item.status}')" title="Avaliar"><i class="fas fa-gavel"></i> Analisar</button>
                `;
            }

            tr.innerHTML = `
                <td>#${item.solicitacao_id}</td>
                <td>${item.descricao || 'Sem descrição'}</td>
                <td>R$ ${Number(item.valor_solicitado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td><span class="status confirm">${item.status}</span></td>
                <td>${botoesAcao || '<span style="color:#aaa">Apenas Leitura</span>'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error(erro);
    }
}

function abrirEdicao(id, descricao, valor) {
    editandoId = id;
    document.getElementById('objetivo').value = descricao;
    document.getElementById('valor').value = valor;
    document.getElementById('modalPatrocinio').style.display = 'block';
}

function abrirAvaliacao(id, descricao, statusAtual) {
    document.getElementById('avaliacaoId').value = id;
    document.getElementById('detalheSolicitacaoTexto').innerText = `Decidindo sobre a solicitação: "${descricao}"`;
    
    const tipo = String(pessoaLogada.pessoa_tipo_id);
    document.getElementById('grupoAprovador').style.display = (tipo === "4") ? 'block' : 'none';
    document.getElementById('grupoAnalista').style.display = (tipo === "3") ? 'block' : 'none';
    
    document.getElementById('selectStatus').value = statusAtual;
    document.getElementById('modalAvaliacao').style.display = 'block';
}

async function deletarSolicitacao(id) {
    if (!confirm("Deseja excluir esta solicitação?")) return;
    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (resposta.ok) { carregarTabela(); }
    } catch (erro) { alert("Erro ao deletar."); }
}

window.abrirEdicao = abrirEdicao;
window.abrirAvaliacao = abrirAvaliacao;
window.deletarSolicitacao = deletarSolicitacao;