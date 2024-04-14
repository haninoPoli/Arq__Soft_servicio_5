from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
app.debug = False
# Define la URL de conexión de MongoDB
mongo_uri = "mongodb://mongo:axfxPntCXsxWNISqLqdJtEqEUYzywocq@viaduct.proxy.rlwy.net:28606"

# Conéctate a la base de datos
client = MongoClient(mongo_uri)
db = client['tu_basededatos']
reservaciones_collection = db['reservaciones']

# Ruta para servir el frontend HTML/JavaScript
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para crear una nueva reservación
@app.route('/api/reservaciones', methods=['POST'])
def crear_reservacion():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)  # Depurar: Imprimir los datos recibidos

        # Obtener las fechas como cadenas desde el JSON
        fecha_inicio_str = data['fecha_inicio']
        fecha_fin_str = data['fecha_fin']
        print("Fecha de inicio:", fecha_inicio_str)  # Depurar: Imprimir la fecha de inicio
        print("Fecha de fin:", fecha_fin_str)  # Depurar: Imprimir la fecha de fin

        # Convertir las cadenas de fecha a objetos datetime
        fecha_inicio = datetime.strptime(fecha_inicio_str, '%Y-%m-%d')
        fecha_fin = datetime.strptime(fecha_fin_str, '%Y-%m-%d')

        # Agregar las fechas al objeto de datos
        data['fecha_inicio'] = fecha_inicio
        data['fecha_fin'] = fecha_fin

        # Insertar la nueva reservación en la base de datos
        reservaciones_collection.insert_one(data)

        return jsonify({'mensaje': 'Reservación creada correctamente'}), 201
    except ValueError as ve:
        print("Error al convertir las fechas:", ve)  # Depurar: Imprimir el error de conversión de fecha
        return jsonify({'mensaje': 'Error en el formato de las fechas'}), 400
    except Exception as e:
        print("Error:", e)  # Depurar: Imprimir otros errores
        return jsonify({'mensaje': 'Error al crear la reservación'}), 500


# Ruta para obtener todas las reservaciones
@app.route('/api/reservaciones', methods=['GET'])
def obtener_reservaciones():
    reservaciones = list(reservaciones_collection.find())
    # Convertir ObjectId a str para JSON serializable
    for reservacion in reservaciones:
        reservacion['_id'] = str(reservacion['_id'])
    return jsonify(reservaciones)


if __name__ == '__main__':
    app.run(debug=True)
