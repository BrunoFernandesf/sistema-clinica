
const selectPaciente = document.getElementById('paciente');
const selectEspecialidade = document.getElementById('especialidade');
const selectMedico = document.getElementById('medico_id');

const form = document.getElementById("form-consulta");

let especialidadesLista = [];


// CARREGAR PACIENTES
function carregarPacientes() {
    return fetch("http://localhost:3000/pacientes/")
    .then(response => response.json())
    .then(pacientes => {
        pacientes.forEach(paciente => {
            const option = document.createElement("option");

            option.value = paciente.id;
            option.textContent = paciente.nome;

            selectPaciente.appendChild(option);
        });
    });
}


// CARREGAR ESPECIALIDADES
function carregarEspecialidades() {
    return fetch("http://localhost:3000/especialidades/")
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


// CARREGAR MÉDICOS DE UMA ESPECIALIDADE
function carregarMedicosPorEspecialidade(especialidade_id, selectDestino) {
    selectDestino.innerHTML = '<option value="">Selecione um médico</option>';
    selectDestino.disabled = true;

    if (!especialidade_id) {
        return Promise.resolve();
    }

    return fetch(`http://localhost:3000/medicos/?especialidade_id=${especialidade_id}`)
    .then(response => response.json())
    .then(medicos => {
        medicos.forEach(medico => {
            const option = document.createElement("option");

            option.value = medico.id;
            option.textContent = medico.nome;

            selectDestino.appendChild(option);
        });

        selectDestino.disabled = false;
    });
}


// QUANDO A ESPECIALIDADE FOR SELECIONADA
selectEspecialidade.addEventListener("change", function() {
    carregarMedicosPorEspecialidade(
        selectEspecialidade.value,
        selectMedico
    );
});


// INICIALIZAÇÃO
carregarPacientes();
carregarEspecialidades();


// CREATE
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const consulta = {
        paciente_id: formData.get("paciente_id"),
        medico_id: formData.get("medico_id"),
        data: formData.get("data"),
        horario: formData.get("horario"),
        status: formData.get("status"),
        observacoes: formData.get("observacoes")
    };

    fetch("http://localhost:3000/consultas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consulta)
    })
    .then(response => {
        if (response.ok) {
            form.reset();

            selectMedico.innerHTML =
                '<option value="">Selecione primeiro uma especialidade</option>';

            selectMedico.disabled = true;

            listarConsultas();
        }
    });
});


// READ
function listarConsultas() {
    fetch("http://localhost:3000/consultas/")
    .then(response => response.json())
    .then(consultas => {

        const lista_consultas = document.getElementById("lista-consultas");
        lista_consultas.innerHTML = "";

        consultas.forEach(consulta => {
            const consulta_div = document.createElement("div");
            consulta_div.className = "card-consulta";

            const botao_excluir = document.createElement("button");
            botao_excluir.className = "botao-excluir";

            const botao_editar = document.createElement("button");

            const consulta_info = document.createElement("p");

            consulta_info.innerHTML = `
                <strong>${consulta.paciente}</strong>
                <br>
                Médico: ${consulta.medico}
                <br>
                Especialidade: ${consulta.especialidade}
                <br>
                Data: ${consulta.data}
                <br>
                Horário: ${consulta.horario}
                <br>
                Status: ${consulta.status}
                <br>
                Observações: ${consulta.observacoes || "Nenhuma"}
            `;

            consulta_div.appendChild(consulta_info);

            botao_editar.innerHTML = "Editar";
            botao_excluir.innerHTML = "Excluir";

            consulta_div.appendChild(botao_editar);
            consulta_div.appendChild(botao_excluir);

            lista_consultas.appendChild(consulta_div);


            // DELETE
            botao_excluir.addEventListener("click", function() {
                fetch(`http://localhost:3000/consultas/${consulta.id}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        listarConsultas();
                    }
                });
            });


            // UPDATE
            botao_editar.addEventListener("click", function() {

                const input_paciente = document.createElement("select");
                const input_especialidade = document.createElement("select");
                const input_medico = document.createElement("select");

                const input_data = document.createElement("input");
                const input_horario = document.createElement("input");
                const input_status = document.createElement("select");
                const input_observacoes = document.createElement("input");

                input_data.type = "date";
                input_horario.type = "time";
                input_observacoes.type = "text";

                const botao_salvar = document.createElement("button");
                botao_salvar.innerHTML = "Salvar";


                // CARREGAR PACIENTES
                fetch("http://localhost:3000/pacientes/")
                .then(response => response.json())
                .then(pacientes => {
                    pacientes.forEach(paciente => {
                        const option = document.createElement("option");

                        option.value = paciente.id;
                        option.textContent = paciente.nome;

                        input_paciente.appendChild(option);
                    });

                    input_paciente.value = consulta.paciente_id;
                });


                // CARREGAR ESPECIALIDADES NO EDITOR
                especialidadesLista.forEach(especialidade => {
                    const option = document.createElement("option");

                    option.value = especialidade.id;
                    option.textContent = especialidade.nome;

                    input_especialidade.appendChild(option);
                });


                // DESCOBRIR A ESPECIALIDADE DO MÉDICO ATUAL
                fetch("http://localhost:3000/medicos/")
                .then(response => response.json())
                .then(medicos => {

                    const medicoAtual = medicos.find(
                        medico => String(medico.id) === String(consulta.medico_id)
                    );

                    if (medicoAtual) {
                        input_especialidade.value = medicoAtual.especialidade_id;

                        return carregarMedicosPorEspecialidade(
                            medicoAtual.especialidade_id,
                            input_medico
                        );
                    }
                })
                .then(() => {
                    input_medico.value = consulta.medico_id;
                });


                // QUANDO ALTERAR A ESPECIALIDADE NA EDIÇÃO
                input_especialidade.addEventListener("change", function() {
                    carregarMedicosPorEspecialidade(
                        input_especialidade.value,
                        input_medico
                    );
                });


                // PREENCHER DEMAIS CAMPOS
                input_data.value = consulta.data;
                input_horario.value = consulta.horario.substring(0, 5);
                input_observacoes.value = consulta.observacoes || "";

                input_status.innerHTML = `
                    <option value="Agendada">Agendada</option>
                    <option value="Realizada">Realizada</option>
                    <option value="Cancelada">Cancelada</option>
                `;

                input_status.value = consulta.status;


                // ADICIONAR CAMPOS À TELA
                consulta_div.appendChild(input_paciente);
                consulta_div.appendChild(input_especialidade);
                consulta_div.appendChild(input_medico);
                consulta_div.appendChild(input_data);
                consulta_div.appendChild(input_horario);
                consulta_div.appendChild(input_status);
                consulta_div.appendChild(input_observacoes);
                consulta_div.appendChild(botao_salvar);


                // SALVAR ALTERAÇÕES
                botao_salvar.addEventListener("click", function() {

                    const consulta_atualizada = {
                        paciente_id: input_paciente.value,
                        medico_id: input_medico.value,
                        data: input_data.value,
                        horario: input_horario.value,
                        status: input_status.value,
                        observacoes: input_observacoes.value
                    };

                    fetch(`http://localhost:3000/consultas/${consulta.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(consulta_atualizada)
                    })
                    .then(response => {
                        if (response.ok) {
                            listarConsultas();
                        }
                    });
                });
            });
        });
    });
}


// CARREGAR LISTAGEM INICIAL
listarConsultas();
