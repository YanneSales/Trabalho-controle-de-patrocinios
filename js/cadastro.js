formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();
    alert(data.mensagem);
    if (response.ok) window.location.href = "login.html";
});