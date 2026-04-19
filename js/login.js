/* Login */
formLogin.addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Simulando busca no "banco" (ou localStorage por enquanto)
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if(!usuarioSalvo || email !== usuarioSalvo.email){
        alert("Usuário não cadastrado! Por favor, realize o cadastro.");
        window.location.href = "cadastro.html"; // Manda ela se cadastrar
        return;
    }

    if(senha !== usuarioSalvo.senha){
        alert("Senha incorreta.");
        return;
    }

    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
});
