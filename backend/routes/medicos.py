from flask import Blueprint, request, jsonify
from db import get_connection

medicos = Blueprint('medicos', __name__)

#CREATE
@medicos.route('/', methods=['POST'])
def cadastrar():
    data = request.json
    print(data)

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["crm"],
        data["telefone"],
        data["email"],
        data["especialidade"]
    )

    sql = """
        INSERT INTO medicos 
        (nome, crm, telefone, email, especialidade)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

#READ
@medicos.route('/', methods=['GET'])
def listar():
    con = get_connection()
    cursor = con.cursor()

    sql = """
        SELECT * FROM medicos
    """

    cursor.execute(sql)

    result = cursor.fetchall()

    medicos_lista = []

    for medico in result:
        medico_dict = {
            "id": medico[0],
            "nome": medico[1],
            "crm": medico[2],
            "telefone": medico[3],
            "email": medico[4],
            "especialidade": medico[5]
        }

        medicos_lista.append(medico_dict)
    print(medicos_lista)    

    return jsonify(medicos_lista)

#UPDATE
@medicos.route('/<int:id>', methods=['PUT'])
def alterar(id):
    data = request.json

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["crm"],
        data["telefone"],
        data["email"],
        data["especialidade"],
        id
    )

    sql = """
        UPDATE medicos
        SET nome =%s, crm =%s, telefone =%s, email =%s, especialidade =%s
        WHERE id =%s
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

@medicos.route('/<int:id>', methods=['DELETE'])
def excluir(id):
    con = get_connection()
    cursor = con.cursor()

    sql = """
        DELETE FROM medicos
        WHERE id = %s
    """

    cursor.execute(sql, (id,))
    con.commit()
    return "OK"