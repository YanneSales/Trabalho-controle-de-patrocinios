document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    // No HTML dela, as IDs são 'email' e 'senha'
    const email = document.getElementById('email').value; 
    const senha = document.getElementById('senha').value; 

    // Dentro do addEventListener de submit:
try {
    const response = await fetch('https://trabalho-controle-de-patrocinios.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }) // Aqui o JS envia o valor, o server recebe como 'email'
    });

    const result = await response.json();

    if (response.ok) {
        alert("Bem-vinda!");
        window.location.href = "pgp.html";
    } else {
        // Isso vai mostrar se o erro é "E-mail ou senha incorretos" ou erro de banco
        alert("Erro: " + result.msg);
    }
} catch (error) {
    alert("O servidor está offline ou acordando. Tente de novo em 30 segundos.");
}
});