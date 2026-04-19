const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", async function(e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const urlRender = "https://trabalho-controle-de-patrocinios.onrender.com"; 

            const resposta = await fetch(`${urlRender}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert(dados.mensagem); // "Cadastro realizado com sucesso!"
                window.location.href = "login.html";
            } else {
                alert(dados.mensagem || "Erro ao cadastrar.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Não foi possível conectar ao servidor. O servidor no Render pode estar 'dormindo'. Tente novamente em 1 minuto.");
        }
    });
}

function voltarLogin() {
    window.location.href = "login.html";
}