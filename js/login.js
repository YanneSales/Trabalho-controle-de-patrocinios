formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.status === 404) {
            alert("Usuário não cadastrado! Redirecionando para o cadastro...");
            window.location.href = "cadastro.html";
        } else if (response.ok) {
            alert(data.mensagem || "Login realizado com sucesso!");
            window.location.href = "pgp.html";
        } else {
            alert("Erro: " + (data.mensagem || "Falha na comunicação com o servidor"));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor. O servidor no Render está ligado?");
    }
});

const btnIrCadastro = document.getElementById("irCadastro");

if (btnIrCadastro) {
    btnIrCadastro.addEventListener("click", function() {
        console.log("Botão clicado, mudando para cadastro..."); // Isso ajuda a ver se o clique funciona
        window.location.href = "cadastro.html";
    });
}