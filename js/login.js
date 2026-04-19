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

    const btnIrCadastro = document.getElementById("irCadastro");
    if(btnIrCadastro){
    btnIrCadastro.addEventListener("click", function(){
        window.location.href = "cadastro.html";
    });
}

});

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.status === 404) {
        alert(data.mensagem); // "Usuário não cadastrado! Por favor, cadastre-se."
        window.location.href = "cadastro.html";
    } else if (response.ok) {
        alert(data.mensagem);
        window.location.href = "pgp.html";
    } else {
        alert(data.mensagem);
    }
});