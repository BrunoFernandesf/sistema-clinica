const selectPaciente = document.getElementById('paciente');
const selectMedico = document.getElementById('medico_id');

const form = document.getElementById("form-consulta");

function carregarPacientes() {
    fetch("http://localhost:3000/pacientes/", {
        method: "GET"
    })
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

function carregarMedicos() {
    fetch("http://localhost:3000/medicos/", {
        method: "GET"
    })
    .then(response => response.json())
    .then(medicos => {
        medicos.forEach(medico => {
            const option = document.createElement("option");

            option.value = medico.id;
            option.textContent = medico.nome;

            selectMedico.appendChild(option);
        });
    });
}

carregarPacientes();
carregarMedicos();

//SUBMIT
form.addEventListener("submit", function(event){
    event.preventDefault();
    const formData = new FormData(form);

    const paciente_id = formData.get("paciente_id");
    const medico_id = formData.get("medico_id");
    const data = formData.get("data");
    const horario = formData.get("horario");
    const status = formData.get("status");
    const observacoes = formData.get("observacoes");

    const consulta = {
        paciente_id: paciente_id,
        medico_id: medico_id,
        data: data,
        horario: horario,
        status: status,
        observacoes: observacoes,
    }

        fetch("http://localhost:3000/consultas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consulta)
    })
    .then(() => {
        form.reset();
        listarConsultas();
    })

});

function listarConsultas(){
fetch("http://localhost:3000/consultas/", {
    method: "GET"
})
    
.then(response => response.json())
    
.then(consultas => {

    const lista_consultas = document.getElementById("lista-consultas")
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

        botao_editar.addEventListener("click", function() {
            const input_paciente = document.createElement("select");
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

            // Carregar pacientes
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

            // Carregar médicos
            fetch("http://localhost:3000/medicos/")
            .then(response => response.json())
            .then(medicos => {
                medicos.forEach(medico => {
                    const option = document.createElement("option");
                    option.value = medico.id;
                    option.textContent = medico.nome;
                    input_medico.appendChild(option);
                });

                input_medico.value = consulta.medico_id;
            });

            // Preencher os demais campos
            input_data.value = consulta.data;
            input_horario.value = consulta.horario.substring(0, 5);
            input_observacoes.value = consulta.observacoes || "";

            input_status.innerHTML = `
                <option value="Agendada">Agendada</option>
                <option value="Realizada">Realizada</option>
                <option value="Cancelada">Cancelada</option>
            `;

            input_status.value = consulta.status;

            // Adicionar campos à tela
            consulta_div.appendChild(input_paciente);
            consulta_div.appendChild(input_medico);
            consulta_div.appendChild(input_data);
            consulta_div.appendChild(input_horario);
            consulta_div.appendChild(input_status);
            consulta_div.appendChild(input_observacoes);
            consulta_div.appendChild(botao_salvar);

            // Salvar alterações
            botao_salvar.addEventListener("click", function() {
                const consulta_atualizado = {
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
                    body: JSON.stringify(consulta_atualizado)
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
};

listarConsultas();
