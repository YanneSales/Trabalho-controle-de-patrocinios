document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    // ✅ CORREÇÃO 1: O ID no seu HTML é 'login', não 'email'
    const loginDigitado = document.getElementById('login').value; 
    const senhaDigitada = document.getElementById('senha').value; 

    try {
        const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // ✅ CORREÇÃO 2: O seu server.js espera 'email' ou 'login'? 
            // Como no seu banco a coluna é 'login', vamos enviar como 'login'
            body: JSON.stringify({ 
            login: document.getElementById('login').value, // E aqui também
            senha:  document.getElementById('senha').value
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Bem-vinda!");
            window.location.href = "pgp.html";
        } else {
            // ✅ CORREÇÃO 3: Garanta qgiue o server responde com 'msg' ou 'mensagem'
            alert("Erro: " + (result.msg || result.mensagem || "Credenciais inválidas"));
        }
    } catch (error) {
        console.error("Erro na conexão:", error);
        alert("O servidor está acordando... Tente novamente em 30 segundos.");
    }
});

// ✅ CORREÇÃO 4: Linkar o botão "Cadastre-se" que está fora do form
const btnIrCadastro = document.getElementById("irCadastro");
if (btnIrCadastro) {
    btnIrCadastro.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });
}