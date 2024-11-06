from flask import Flask, request, jsonify
import pickle  # Or any library you used to save/load your model

app = Flask(__name__)

# Load your model 
with open('path_to_your_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.get_json()

    # Ensure the input data is in the correct format
    input_data = data.get('input')

    # Make predictions (adjust based on your model)
    prediction = model.predict([input_data])

    # Return the prediction as a JSON response
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
