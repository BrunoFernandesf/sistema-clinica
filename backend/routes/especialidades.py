from flask import Blueprint, request, jsonify
from db import get_connection

especialidades = Blueprint('especialidades', __name__)

#CREATE
@especialidades.route('/', methods=['POST'])
def cadastrar():
    data = request.json
    print(data)

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["descricao"]
    )
    sql = """
        INSERT INTO especialidades 
        (nome, descricao)
        VALUES (%s, %s)
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

#READ
@especialidades.route('/', methods=['GET'])
def listar():
    con = get_connection()
    cursor = con.cursor()

    sql = """
        SELECT * FROM especialidades
    """

    cursor.execute(sql)

    result = cursor.fetchall()

    especialidades_lista = []

    for especialidade in result:
        especialidade_dict = {
            "id": especialidade[0],
            "nome": especialidade[1],
            "descricao": especialidade[2]
        }

        especialidades_lista.append(especialidade_dict)
    print(especialidades_lista)    

    return jsonify(especialidades_lista)

#UPDATE
@especialidades.route('/<int:id>', methods=['PUT'])
def alterar(id):
    data = request.json

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["nome"],
        data["descricao"],
        id
    )

    sql = """
        UPDATE especialidades
        SET nome =%s, descricao =%s
        WHERE id =%s
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

@especialidades.route('/<int:id>', methods=['DELETE'])
def excluir(id):
    con = get_connection()
    cursor = con.cursor()

    sql = """
        DELETE FROM especialidades
        WHERE id = %s
    """

    cursor.execute(sql, (id,))
    con.commit()
    return "OK"