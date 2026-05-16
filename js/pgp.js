const API_URL = 'https://trabalho-controle-de-patrocinios.onrender.com/solicitacoes'; // Mude para a URL remota se subir o backend também

// Variável global para sabermos se estamos salvando um novo ou editando um existente
let editandoId = null; 

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalPatrocinio');
    const btnNovoPatrocinio = document.getElementById('btnNovoPatrocinio');
    const btnFecharModal = document.querySelector('.close-modal');
    const formPatrocinio = document.getElementById('formPatrocinio');
    const botaoConfig = document.getElementById('btnConfig');

    // Carregar a tabela assim que abrir a página
    carregarTabela();

    // --- CONTROLE DO MODAL ---
    if (btnNovoPatrocinio) {
        btnNovoPatrocinio.addEventListener('click', () => {
            editandoId = null; // Modo Criação
            formPatrocinio.reset();
            document.querySelector('.modal-content h2').innerHTML = '<i class="fas fa-file-contract"></i> Novo Fluxo de Patrocínio';
            modal.style.display = 'block';
        });
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => modal.style.display = 'none');
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    if (botaoConfig) {
        botaoConfig.addEventListener('click', () => alert("Funções implementadas futuramente"));
    }

    // --- SUBMIT DO FORMULÁRIO (CREATE & UPDATE) ---
    formPatrocinio.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que a página recarregue do jeito antigo

        const dados = {
            descricao: document.getElementById('objetivo').value,
            valor_solicitado: document.getElementById('valor').value
        };

        try {
            let resposta;
            // Se tiver um ID guardado na variável, faz um PUT (Update), senão faz um POST (Create)
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
                modal.style.display = 'none'; // Fecha a janela
                formPatrocinio.reset(); // Limpa os campos
                carregarTabela(); // Atualiza a tabela na hora sem atualizar a página inteira!
            } else {
                alert(resultado.msg);
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
});

// --- R - READ: BUSCAR DADOS DO BACKEND E DESENHAR A TABELA ---
async function carregarTabela() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    try {
        const resposta = await fetch(API_URL);
        const solicitacoes = await resposta.json();

        tbody.innerHTML = ''; // Limpa a tabela antes de preencher

        if (solicitacao.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">Nenhum patrocínio cadastrado.</td></tr>`;
            return;
        }

        solicitacoes.forEach(item => {
            // Garante que o status tenha um texto padrão caso venha nulo do banco
            const statusTexto = item.status || 'Pendente';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${item.solicitacao_id}</td>
                <td>${item.descricao || 'Sem descrição'}</td>
                <td>R$ ${item.valor_solicitado ? Number(item.valor_solicitado).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}</td>
                <td><span class="status ${statusTexto.toLowerCase() === 'confirmado' ? 'confirm' : 'pending'}">${statusTexto}</span></td>
                <td>
                    <button class="btn-edit" onclick="abrirEdicao(${item.solicitacao_id}, '${item.descricao || ''}', ${item.valor_solicitado || 0})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deletarSolicitacao(${item.solicitacao_id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error("Erro ao carregar tabela:", erro);
    }
}

// --- U - UPDATE: PREPARAR O MODAL PARA EDIÇÃO ---
function abrirEdicao(id, descricao, valor) {
    editandoId = id; // Guarda o ID para sabermos quem atualizar
    document.getElementById('objetivo').value = descricao;
    document.getElementById('valor').value = valor;
    
    // Muda o título do modal para o usuário ver que está editando
    document.querySelector('.modal-content h2').innerHTML = '<i class="fas fa-edit"></i> Atualizar Patrocínio';
    document.getElementById('modalPatrocinio').style.display = 'block';
}

// --- D - DELETE: MANDAR A ORDEM DE EXCLUSÃO ---
async function deletarSolicitacao(id) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.msg);
            carregarTabela(); // Atualiza a lista na tela
        } else {
            alert(resultado.msg);
        }
    } catch (erro) {
        console.error("Erro ao deletar:", erro);
    }
}

// === ISSO DEVE FICAR FORA DE TUDO, NA ÚLTIMA LINHA DO ARQUIVO ===
// Torna as funções visíveis globalmente para os cliques de botões do HTML funcionar
window.abrirEdicao = abrirEdicao;
window.deletarSolicitacao = deletarSolicitacao;