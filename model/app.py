from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

# from model.recommendation_model import content_based_recommendations
# Load the model and data
with open('recommendation_model.pkl', 'rb') as file:
    model_data = pickle.load(file)

train_data = model_data['train_data']
tfidf_vectorizer = model_data['tfidf_vectorizer']
cosine_similarities_content = model_data['cosine_similarities_content']

from rapidfuzz import process

def find_closest_match(input_name, train_data):
    # Use rapidfuzz to find the closest match in the 'name' column
    names = train_data['name'].tolist()
    closest_match, score, _ = process.extractOne(input_name, names)  # Ignore the index
    return closest_match, score

def content_based_recommendations(train_data, item_name, top_n=10):
    # Find the closest match to the input name
    closest_match, score = find_closest_match(item_name, train_data)
    
    # Set a threshold for match confidence (e.g., 70%)
    if score < 70:
        print(f"No close match found for '{item_name}'. Please try a different name.")
        return pd.DataFrame()
    
    print(f"Using closest match: '{closest_match}' (score: {score})")
    
    # Proceed with the closest match
    item_index = train_data[train_data['name'] == closest_match].index[0]

    # Get the cosine similarity scores for the item
    similar_items = list(enumerate(cosine_similarities_content[item_index]))

    # Sort similar items by similarity score in descending order
    similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

    # Get the top N most similar items (excluding the item itself)
    top_similar_items = similar_items[1:top_n+1]

    # Get the indices of the top similar items
    recommended_item_indices = [x[0] for x in top_similar_items]

    # Get the details of the top similar items
    recommended_items_details = train_data.iloc[recommended_item_indices][['name', 'company', 'category']]

    return recommended_items_details


# # Recommendation function
# def content_based_recommendations(item_name, top_n=10):
#     if item_name not in train_data['name'].values:
#         return pd.DataFrame()

#     # Find the index of the item
#     item_index = train_data[train_data['name'] == item_name].index[0]

#     # Get the cosine similarity scores for the item
#     similar_items = list(enumerate(cosine_similarities_content[item_index]))

#     # Sort similar items by similarity score in descending order
#     similar_items = sorted(similar_items, key=lambda x: x[1], reverse=True)

#     # Get the top N most similar items (excluding the item itself)
#     top_similar_items = similar_items[1:top_n+1]

#     # Get the indices of the top similar items
#     recommended_item_indices = [x[0] for x in top_similar_items]

#     # Get the details of the top similar items
#     recommended_items_details = train_data.iloc[recommended_item_indices][['id','name','company','description','price','category','stock','images','sellerName']]

#     return recommended_items_details

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
                "success": True,
                "message": f"No recommendations found for the item '{item_name}'.",
                "recommendations": []
            }), 200

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
