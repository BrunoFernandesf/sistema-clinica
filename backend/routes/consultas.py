from flask import Blueprint, request, jsonify
from db import get_connection

consultas = Blueprint('consultas', __name__)

#CREATE
@consultas.route('/', methods=['POST'])
def cadastrar():
    data = request.json
    print(data)

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["paciente_id"],
        data["medico_id"],
        data["data"],
        data["horario"],
        data["status"],
        data["observacoes"]
    )
    sql = """
        INSERT INTO consultas 
        (paciente_id, medico_id, data, horario, status, observacoes)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

# READ
@consultas.route('/', methods=['GET'])
def listar():
    con = get_connection()
    cursor = con.cursor()

    sql = sql = """
        SELECT
            c.id,
            c.paciente_id,
            c.medico_id,
            p.nome AS paciente,
            m.nome AS medico,
            e.nome AS especialidade,
            c.data,
            c.horario,
            c.status,
            c.observacoes
        FROM consultas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.medico_id = m.id
        JOIN especialidades e ON m.especialidade_id = e.id;
    """
    cursor.execute(sql)

    result = cursor.fetchall()

    consultas_lista = []

    for consulta in result:
        consulta_dict = {
            "id": consulta[0],
            "paciente_id": consulta[1],
            "medico_id": consulta[2],
            "paciente": consulta[3],
            "medico": consulta[4],
            "especialidade": consulta[5],
            "data": consulta[6].isoformat(),
            "horario": str(consulta[7]),
            "status": consulta[8],
            "observacoes": consulta[9]
        }

        consultas_lista.append(consulta_dict)
    print(consultas_lista)    

    return jsonify(consultas_lista)

#UPDATE
@consultas.route('/<int:id>', methods=['PUT'])
def alterar(id):
    data = request.json

    con = get_connection()
    cursor = con.cursor()

    valores = (
        data["paciente_id"],
        data["medico_id"],
        data["data"],
        data["horario"],
        data["status"],
        data["observacoes"],
        id,
    )

    sql = """
        UPDATE consultas
        SET paciente_id = %s,
            medico_id = %s,
            data = %s,
            horario = %s,
            status = %s,
            observacoes = %s
        WHERE id =%s
    """

    cursor.execute(sql, valores)
    con.commit()

    return "OK"

#DELETE
@consultas.route('/<int:id>', methods=['DELETE'])
def excluir(id):
    con = get_connection()
    cursor = con.cursor()

    sql = """
        DELETE FROM consultas
        WHERE id = %s
    """

    cursor.execute(sql, (id,))
    con.commit()
    return "OK"