formLogin.addEventListener("submit", async function(e){
    e.preventDefault();
    // Pegar valores de email e senha

    const resposta = await fetch('https://trabalho-controle-de-patrocinios.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.status === 404) {
        alert("Usuário não cadastrado! Por favor, cadastre-se.");
        window.location.href = "cadastro.html";
        return;
    }

    if (resposta.ok) {
        alert("Bem-vindo(a)!");
        window.location.href = "pgp.html";
    } else {
        alert(dados.mensagem);
    }
});