from flask import Blueprint, request, jsonify
from db import get_connection

pacientes = Blueprint('pacientes', __name__)

#CREATE
@pacientes.route('/', methods=['POST'])
def cadastrar():
    data = request.json
    print(data)

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["cpf"],
        data["data_nascimento"],
        data["telefone"],
        data["email"],
        data["endereco"]
    )

    sql = """
        INSERT INTO pacientes
        (nome, cpf, data_nascimento, telefone, email, endereco)
        VALUES  (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

#READ
@pacientes.route('/', methods=['GET'])
def listar():
    con = get_connection()
    cursor = con.cursor()

    sql = """
        SELECT * FROM pacientes
    """

    cursor.execute(sql)

    result = cursor.fetchall()

    pacientes_lista = []

    for paciente in result:
        paciente_dict = {
            "id": paciente[0],
            "nome": paciente[1],
            "cpf": paciente[2],
            "data_nascimento": paciente[3].isoformat(),
            "telefone": paciente[4],
            "email": paciente[5],
            "endereco": paciente[6]
        }

        pacientes_lista.append(paciente_dict)
    print(pacientes_lista)    

    return jsonify(pacientes_lista)

#UPDATE
@pacientes.route('/<int:id>', methods=['PUT'])
def alterar(id):
    data = request.json

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["cpf"],
        data["data_nascimento"],
        data["telefone"],
        data["email"],
        data["endereco"],
        id
    )

    sql = """
        UPDATE pacientes
        SET nome =%s, cpf =%s, data_nascimento =%s, telefone =%s, email =%s, endereco =%s
        WHERE id =%s
    """

    cursor.execute(sql, valores)
    con.commit()
    return "OK"

@pacientes.route('/<int:id>', methods=['DELETE'])
def excluir(id):
    con = get_connection()
    cursor = con.cursor()

    sql = """
        DELETE FROM pacientes
        WHERE id = %s
    """

    cursor.execute(sql, (id,))
    con.commit()
    return "OK"

