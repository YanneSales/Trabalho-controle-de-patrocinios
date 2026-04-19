document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    // No HTML dela, as IDs são 'email' e 'senha'
    const email = document.getElementById('email').value; 
    const senha = document.getElementById('senha').value; 

    try {
        // ⚠️ Ela deve usar a URL do Render DELA aqui
        const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ⚠️ No server.js dela, o banco espera { email, senha }
            body: JSON.stringify({ email, senha }) 
        });

        const result = await response.json();

        if (response.status === 404) {
            // Regra que você pediu: Se não existir, avisa e manda cadastrar
            alert("Usuário não cadastrado! Por favor, faça seu cadastro.");
            window.location.href = "cadastro.html";
            return;
        }

        if (response.ok) {
            alert("Login realizado com sucesso!");
            // No caso dela, a página principal é a pgp.html ou index.html
            window.location.href = "pgp.html"; 
        } else {
            // No server dela a resposta é .mensagem e não .msg
            alert("Erro: " + (result.mensagem || "Falha no login"));
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("O servidor está acordando no Render... Aguarde uns segundos e tente de novo.");
    }
});