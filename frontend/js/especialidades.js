const form = document.getElementById("form-especialidade");

//SUBMIT
form.addEventListener("submit", function(event){
    event.preventDefault();
    const formData = new FormData(form);

    const nome = formData.get("nome");
    const descricao = formData.get("descricao");

    const especialidade = {
        nome: nome,
        descricao: descricao
    }

        fetch("http://localhost:3000/especialidades/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(especialidade)
    })
    .then(() => {
        form.reset();
    })

});


fetch("http://localhost:3000/especialidades/", {
    method: "GET"
})
    
.then(response => response.json())
    
.then(especialidades => {
    console.log(especialidades);

    const lista_especialidades = document.getElementById("lista-especialidades") 

    especialidades.forEach(especialidade => {
        const especialidade_div = document.createElement("div");
        especialidade_div.className = "card-especialidade";
        const botao_excluir = document.createElement("button");
        botao_excluir.className = "botao-excluir";
        const botao_editar = document.createElement("button");

        const especialidade_info = document.createElement("p");

        especialidade_info.innerHTML = `
            <strong>${especialidade.nome}</strong>
            <br>
            Descricao: ${especialidade.descricao}
        `;
        especialidade_div.appendChild(especialidade_info);

        botao_editar.innerHTML = "Editar";
        botao_excluir.innerHTML = "Excluir";
  
        especialidade_div.appendChild(botao_editar);
        especialidade_div.appendChild(botao_excluir);
        lista_especialidades.appendChild(especialidade_div);

        botao_excluir.addEventListener("click", function() {
            fetch(`http://localhost:3000/especialidades/${especialidade.id}`, {
                method: "DELETE",
            });

            lista_especialidades.removeChild(especialidade_div);
        });

        botao_editar.addEventListener("click", function() {
            const input_nome = document.createElement("input");
            const input_descricao = document.createElement("input");

            const botao_salvar = document.createElement("button");

            botao_salvar.innerHTML = "Salvar";

            input_nome.value = especialidade.nome;
            input_descricao.value = especialidade.descricao;

            especialidade_div.appendChild(input_nome);
            especialidade_div.appendChild(input_descricao);

            especialidade_div.appendChild(botao_salvar);

            botao_salvar.addEventListener("click", function() {
                const novo_nome = input_nome.value;
                const novo_descricao = input_descricao.value;

                const especialidade_atualizado = {
                nome: novo_nome,
                descricao: novo_descricao
                };

                console.log(especialidade_atualizado);

                fetch(`http://localhost:3000/especialidades/${especialidade.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(especialidade_atualizado)
                });

                especialidade.nome = novo_nome;
                especialidade.descricao = novo_descricao;

                especialidade_info.innerHTML = `
                    <strong>${especialidade.nome}</strong>
                    <br>
                    Descricao: ${especialidade.descricao}
                `;
            });
        });
    });
    
});