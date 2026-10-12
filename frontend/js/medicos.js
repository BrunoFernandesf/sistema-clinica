const form = document.getElementById("form-medico");

//SUBMIT
form.addEventListener("submit", function(event){
    event.preventDefault();
    const formData = new FormData(form);

    const nome = formData.get("nome");
    const crm = formData.get("crm");
    const telefone = formData.get("telefone");
    const email = formData.get("email");
    const especialidade = formData.get("especialidade");

    const medico = {
        nome: nome,
        crm: crm,
        telefone: telefone,
        email: email,
        especialidade: especialidade
    }

        fetch("http://localhost:3000/medicos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medico)
    });

});


fetch("http://localhost:3000/medicos/", {
    method: "GET"
})
    
.then(response => response.json())
    
.then(medicos => {
    console.log(medicos);

    const lista_medicos = document.getElementById("lista-medicos") 

    medicos.forEach(medico => {
        const medico_div = document.createElement("div");
        medico_div.className = "card-medico";
        const botao_excluir = document.createElement("button");
        botao_excluir.className = "botao-excluir";
        const botao_editar = document.createElement("button");

        const medico_info = document.createElement("p");

        medico_info.innerHTML = `
            <strong>${medico.nome}</strong>
            <br>
            CRM: ${medico.crm}
            <br>
            Telefone: ${medico.telefone}
            <br>
            Email: ${medico.email}
            <br>
            Especialidade: ${medico.especialidade}
        `;
        medico_div.appendChild(medico_info);

        botao_editar.innerHTML = "Editar";
        botao_excluir.innerHTML = "Excluir";
  
        medico_div.appendChild(botao_editar);
        medico_div.appendChild(botao_excluir);
        lista_medicos.appendChild(medico_div);

        botao_excluir.addEventListener("click", function() {
            fetch(`http://localhost:3000/medicos/${medico.id}`, {
                method: "DELETE",
            });

            lista_medicos.removeChild(medico_div);
        });

        botao_editar.addEventListener("click", function() {
            const input_nome = document.createElement("input");
            const input_crm = document.createElement("input");
            const input_telefone = document.createElement("input");
            const input_email = document.createElement("input");
            const input_especialidade = document.createElement("input");
            const botao_salvar = document.createElement("button");

            botao_salvar.innerHTML = "Salvar";

            input_nome.value = medico.nome;
            input_crm.value = medico.crm;
            input_telefone.value = medico.telefone;
            input_email.value = medico.email;
            input_especialidade.value = medico.especialidade;

            medico_div.appendChild(input_nome);
            medico_div.appendChild(input_crm);
            medico_div.appendChild(input_telefone);
            medico_div.appendChild(input_email);
            medico_div.appendChild(input_especialidade);

            medico_div.appendChild(botao_salvar);

            botao_salvar.addEventListener("click", function() {
                const novo_nome = input_nome.value;
                const novo_crm = input_crm.value;
                const novo_telefone = input_telefone.value;
                const novo_email = input_email.value;
                const novo_especialidade = input_especialidade.value;

                const medico_atualizado = {
                nome: novo_nome,
                crm: novo_crm,
                telefone: novo_telefone,
                email: novo_email,
                especialidade: novo_especialidade
                };

                console.log(medico_atualizado);

                fetch(`http://localhost:3000/medicos/${medico.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(medico_atualizado)
                });

                medico.nome = novo_nome;
                medico.crm = novo_crm;
                medico.telefone = novo_telefone;
                medico.email = novo_email;
                medico.especialidade = novo_especialidade;

                medico_info.innerHTML = `
                    <strong>${medico.nome}</strong>
                    <br>
                    CRM: ${medico.crm}
                    <br>
                    Telefone: ${medico.telefone}
                    <br>
                    Email: ${medico.email}
                    <br>
                    Especialidade: ${medico.especialidade}
                `;
            });
        });
    });
    
});