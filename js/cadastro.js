formCadastro.addEventListener("submit", async function(e){
    e.preventDefault();
    // Pegar valores dos inputs (nome, email, senha...)

    const resposta = await fetch('https://trabalho-controle-de-patrocinios.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const dados = await resposta.json();
    alert(dados.mensagem);

    if (resposta.ok) {
        window.location.href = "login.html"; // Volta para o login após sucesso
    }
});