from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return render_template('app.html')
@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({'locations': util.get_location_names()})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()  # Get JSON data from the request

    # Extract data from the JSON payload
    sqft = float(data['total_sqft'])
    bath = int(data['bath'])
    bhk = int(data['bhk'])
    location = data['location']

    # Get the estimated price
    my_prediction = util.get_estimated_price(location, sqft, bhk, bath)
    output = round(my_prediction, 2)

    # Return a custom message with the estimated price
    message = f'{output} Lakhs'
    return jsonify({'message': message})


if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run(debug=True)
