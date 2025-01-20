from flask import Blueprint, jsonify
from .controllers.review_controllers import analyze_reviews
from .controllers.recommendations_controller import get_recommendations

# Define a blueprint for routes
review_routes = Blueprint("review_routes", __name__)
recommendation_routes = Blueprint("recommendation_routes", __name__)
# hello_routes = Blueprint("hello_routes", __name__)

# Route for analyzing reviews
@review_routes.route('/analyze_reviews', methods=['POST'])
def analyze_reviews_route():
    return analyze_reviews()

# Route for fetching recommendations
@recommendation_routes.route('/get_recommendations/<user_id>', methods=['GET'])
def get_recommendations_route(user_id):
    return get_recommendations(user_id)

# @hello_routes.route('/hello', methods=['GET'])
# def hello():
#     return jsonify({"success": True, "data": 'hello'})