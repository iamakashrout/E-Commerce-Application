from flask import Flask, request, jsonify
import numpy as np
import pandas as pd

from recommendation_logic import content_based_recommendations

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

train_data = pd.read_csv('products.csv')

# Health Check Endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Flask server is running!"})

# Endpoint to get recommendations
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    try:
        # Get query parameters
        item_name = request.args.get('item_name')
        top_n = request.args.get('top_n', default=4, type=int)

        if not item_name:
            return jsonify({
                "success": False,
                "message": "Item name is required."
            }), 400

        # Fetch recommendations
        recommendations = content_based_recommendations(train_data, item_name, top_n)

        if recommendations.empty:
            return jsonify({
                "success": False,
                "message": f"No recommendations found for the item '{item_name}'."
            }), 404

        # Convert recommendations to a list of dictionaries for JSON response
        recommendations_list = recommendations.to_dict(orient='records')

        return jsonify({
            "success": True,
            "recommendations": recommendations_list
        }), 200

    except Exception as e:
        print(f"Error fetching recommendations: {e}")
        return jsonify({
            "success": False,
            "error": "An error occurred while fetching recommendations."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
