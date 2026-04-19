document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value; // No dela é email
    const senha = document.getElementById('senha').value;

    try {
        // Ela deve usar a URL do Render dela aqui:
        const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }) // Enviando 'email'
        });

        const result = await response.json();

        if (response.ok) {
            alert("Sucesso: " + result.mensagem);
            window.location.href = "login.html";
        } else {
            alert("Erro: " + result.mensagem);
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("O servidor está acordando... Tente novamente em instantes.");
    }
});