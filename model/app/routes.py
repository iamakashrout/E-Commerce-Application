from flask import Blueprint
from .controllers.review_controllers import analyze_reviews

# Define a blueprint for review routes
review_routes = Blueprint("review_routes", __name__)

# Route for analyzing reviews
@review_routes.route('/analyze-reviews', methods=['POST'])
def analyze_reviews_route():
    return analyze_reviews()