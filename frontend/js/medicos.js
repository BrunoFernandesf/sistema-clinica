
const form = document.getElementById("form-medico");
const selectEspecialidade = document.getElementById("especialidade");

let especialidadesLista = [];

// CARREGAR ESPECIALIDADES
function carregarEspecialidades() {
    fetch("http://localhost:3000/especialidades/")
    .then(response => response.json())
    .then(especialidades => {
        especialidadesLista = especialidades;

        especialidades.forEach(especialidade => {
            const option = document.createElement("option");
            option.value = especialidade.id;
            option.textContent = especialidade.nome;

            selectEspecialidade.appendChild(option);
        });
    });
}


// CREATE
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const especialidade_id = formData.get("especialidade_id");

    const especialidadeSelecionada = especialidadesLista.find(
        especialidade => String(especialidade.id) === String(especialidade_id)
    );

    const medico = {
        nome: formData.get("nome"),
        crm: formData.get("crm"),
        telefone: formData.get("telefone"),
        email: formData.get("email"),
        especialidade: especialidadeSelecionada.nome,
        especialidade_id: especialidade_id
    };

    fetch("http://localhost:3000/medicos/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(medico)
    })
    .then(response => {
        if (response.ok) {
            form.reset();
            listarMedicos();
        }
    });
});


// READ
function listarMedicos() {
    fetch("http://localhost:3000/medicos/")
    .then(response => response.json())
    .then(medicos => {
        const lista_medicos = document.getElementById("lista-medicos");

        lista_medicos.innerHTML = "";

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


            // DELETE
            botao_excluir.addEventListener("click", function() {
                fetch(`http://localhost:3000/medicos/${medico.id}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        listarMedicos();
                    }
                });
            });


            // UPDATE
            botao_editar.addEventListener("click", function() {
                const input_nome = document.createElement("input");
                const input_crm = document.createElement("input");
                const input_telefone = document.createElement("input");
                const input_email = document.createElement("input");
                const input_especialidade = document.createElement("select");

                const botao_salvar = document.createElement("button");

                input_nome.value = medico.nome;
                input_crm.value = medico.crm;
                input_telefone.value = medico.telefone;
                input_email.value = medico.email;

                // Preencher opções de especialidade
                especialidadesLista.forEach(especialidade => {
                    const option = document.createElement("option");

                    option.value = especialidade.id;
                    option.textContent = especialidade.nome;

                    input_especialidade.appendChild(option);
                });

                input_especialidade.value = medico.especialidade_id;

                botao_salvar.innerHTML = "Salvar";

                medico_div.appendChild(input_nome);
                medico_div.appendChild(input_crm);
                medico_div.appendChild(input_telefone);
                medico_div.appendChild(input_email);
                medico_div.appendChild(input_especialidade);
                medico_div.appendChild(botao_salvar);


                botao_salvar.addEventListener("click", function() {
                    const especialidade_id = input_especialidade.value;

                    const especialidadeSelecionada = especialidadesLista.find(
                        especialidade => String(especialidade.id) === String(especialidade_id)
                    );

                    const medico_atualizado = {
                        nome: input_nome.value,
                        crm: input_crm.value,
                        telefone: input_telefone.value,
                        email: input_email.value,
                        especialidade: especialidadeSelecionada.nome,
                        especialidade_id: especialidade_id
                    };

                    fetch(`http://localhost:3000/medicos/${medico.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(medico_atualizado)
                    })
                    .then(response => {
                        if (response.ok) {
                            listarMedicos();
                        }
                    });
                });
            });
        });
    });
}


// INICIALIZAÇÃO
carregarEspecialidades().then(() => {
    listarMedicos();
});
