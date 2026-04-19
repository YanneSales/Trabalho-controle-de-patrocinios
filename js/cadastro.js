// Função para o botão Voltar
window.voltarLogin = function() {
    window.location.href = "login.html";
};

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value; // Pegando o ID 'login' do HTML
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviando 'login' para bater com a coluna do banco dela
            body: JSON.stringify({ nome, login, senha }) 
        });

        const result = await response.json();

        if (response.ok) {
            alert("Sucesso: " + (result.msg || result.mensagem));
            window.location.href = "login.html";
        } else {
            alert("Erro: " + (result.msg || result.mensagem));
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("O servidor está conectando... Tente novamente em instantes.");
    }
});