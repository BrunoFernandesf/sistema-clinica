const form = document.getElementById("form-paciente");

//SUBMIT
form.addEventListener("submit", function(event){
    event.preventDefault();
    const formData = new FormData(form);

    const nome = formData.get("nome");
    const cpf = formData.get("cpf");
    const dataNascimento = formData.get("data_nascimento");
    const telefone = formData.get("telefone");
    const email = formData.get("email");
    const endereco = formData.get("endereco");

    const paciente = {
        nome: nome,
        cpf: cpf,
        data_nascimento: dataNascimento,
        telefone: telefone,
        email: email,
        endereco: endereco
    }

        fetch("http://localhost:3000/pacientes/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paciente)
    });

});


fetch("http://localhost:3000/pacientes/", {
    method: "GET"
})
    
.then(response => response.json())
    
.then(pacientes => {
    console.log(pacientes);

    const lista_pacientes = document.getElementById("lista-pacientes") 

    pacientes.forEach(paciente => {
        const paciente_div = document.createElement("div");
        paciente_div.className = "card-paciente";
        const botao_excluir = document.createElement("button");
        botao_excluir.className = "botao-excluir";
        const botao_editar = document.createElement("button");

        const paciente_info = document.createElement("p");

        paciente_info.innerHTML = `
            <strong>${paciente.nome}</strong>
            <br>
            CPF: ${paciente.cpf}
            <br>
            Data de nascimento: ${paciente.data_nascimento}
            <br>
            Telefone: ${paciente.telefone}
            <br>
            Email: ${paciente.email}
            <br>
            Endereço: ${paciente.endereco}
        `;
        paciente_div.appendChild(paciente_info);

        botao_editar.innerHTML = "Editar";
        botao_excluir.innerHTML = "Excluir";
  
        paciente_div.appendChild(botao_editar);
        paciente_div.appendChild(botao_excluir);
        lista_pacientes.appendChild(paciente_div);

        botao_excluir.addEventListener("click", function() {
            fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
                method: "DELETE",
            });

            lista_pacientes.removeChild(paciente_div);
        });

        botao_editar.addEventListener("click", function() {
            const input_nome = document.createElement("input");
            const input_cpf = document.createElement("input");
            const input_data_nascimento = document.createElement("input");
            input_data_nascimento.type = "date";
            const input_telefone = document.createElement("input");
            const input_email = document.createElement("input");
            const input_endereco = document.createElement("input");
            const botao_salvar = document.createElement("button");

            botao_salvar.innerHTML = "Salvar";

            input_nome.value = paciente.nome;
            input_cpf.value = paciente.cpf;
            input_data_nascimento.value = paciente.data_nascimento;
            input_telefone.value = paciente.telefone;
            input_email.value = paciente.email;
            input_endereco.value = paciente.endereco;

            paciente_div.appendChild(input_nome);
            paciente_div.appendChild(input_cpf);
            paciente_div.appendChild(input_data_nascimento);
            paciente_div.appendChild(input_telefone);
            paciente_div.appendChild(input_email);
            paciente_div.appendChild(input_endereco);

            paciente_div.appendChild(botao_salvar);

            botao_salvar.addEventListener("click", function() {
                const novo_nome = input_nome.value;
                const novo_cpf = input_cpf.value;
                const nova_data_nascimento = input_data_nascimento.value;
                const novo_telefone = input_telefone.value;
                const novo_email = input_email.value;
                const novo_endereco = input_endereco.value;

                const paciente_atualizado = {
                nome: novo_nome,
                cpf:novo_cpf,
                data_nascimento: nova_data_nascimento,
                telefone: novo_telefone,
                email: novo_email,
                endereco: novo_endereco
                };

                console.log(paciente_atualizado);

                fetch(`http://localhost:3000/pacientes/${paciente.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(paciente_atualizado)
                });

                paciente.nome = novo_nome;
                paciente.cpf = novo_cpf;
                paciente.data_nascimento = nova_data_nascimento;
                paciente.telefone = novo_telefone;
                paciente.email = novo_email;
                paciente.endereco = novo_endereco;

                paciente_info.innerHTML = `
                    <strong>${paciente.nome}</strong>
                    <br>
                    CPF: ${paciente.cpf}
                    <br>
                    Data de nascimento: ${paciente.data_nascimento}
                    <br>
                    Telefone: ${paciente.telefone}
                    <br>
                    Email: ${paciente.email}
                    <br>
                    Endereço: ${paciente.endereco}
                `;
            });
        });
    });
    
});