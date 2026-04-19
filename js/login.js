const formLogin = document.getElementById("formLogin");
const btnIrCadastro = document.getElementById("irCadastro");

if (formLogin) {
    formLogin.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const urlRender = "https://trabalho-controle-de-patrocinios.onrender.com";

            const resposta = await fetch(`${urlRender}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (resposta.status === 404) {
                alert("Usuário não cadastrado! Redirecionando para cadastro...");
                window.location.href = "cadastro.html";
            } else if (resposta.ok) {
                alert(dados.mensagem);
                window.location.href = "pgp.html";
            } else {
                alert(dados.mensagem || "Erro no login.");
            }
        } catch (error) {
            alert("Erro de conexão. Verifique se o servidor no Render está ativo.");
        }
    });
}

if (btnIrCadastro) {
    btnIrCadastro.addEventListener("click", () => window.location.href = "cadastro.html");
}