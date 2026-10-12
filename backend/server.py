from flask import Flask
from flask_cors import CORS
from routes.pacientes import pacientes
from routes.medicos import medicos

app = Flask(__name__)
CORS(app)

app.register_blueprint(pacientes, url_prefix='/pacientes')
app.register_blueprint(medicos, url_prefix='/medicos')

if __name__ == '__main__':
    app.run(port=3000, debug=True)