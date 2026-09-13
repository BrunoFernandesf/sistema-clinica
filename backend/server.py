from flask import Flask
from flask_cors import CORS
from routes.pacientes import pacientes

app = Flask(__name__)
CORS(app)

app.register_blueprint(pacientes, url_prefix='/pacientes')

if __name__ == '__main__':
    app.run(port=3000, debug=True)