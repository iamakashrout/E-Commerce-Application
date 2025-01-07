from flask import jsonify
from app.models.cart import Cart
from app.models.order import Order
from app.models.product import Product
from app.utils.to_string import objectid_to_str
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(user_id):
    try:
        # user data
        unique_product_list = fetch_user_data(user_id)

        # all available products
        products = Product.get_products()
        if not products:
            return jsonify({"success": False, "error": "No products available"})
        products = [objectid_to_str(product) for product in products]

        # product embeddings
        product_embeddings = generate_product_embeddings(products)

        # Generate embeddings for unique user products
        user_product_ids = {product["productId"] for product in unique_product_list}
        if product_embeddings is None:
            return jsonify({"success": False, "error": "No product embeddings available"})
        user_embeddings = np.array([
            product_embeddings[pid] for pid in user_product_ids if pid in product_embeddings
        ])
        if user_embeddings.size == 0:
            return jsonify({"success": True, "data": []})
        
        # get recommendations according to similarity
        recommendations = get_similarity(products, product_embeddings, user_embeddings)

        # response = {
        #     "user_products": unique_product_list,
        #     "recommendations": recommendations,
        # }

        return jsonify({"success": True, "data": recommendations})
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"error": "Error fetching recommendations"}
    



# Sentence Transformer Model
model = SentenceTransformer('all-MiniLM-L6-v2')

# function to generate embeddings
def generate_product_embeddings(products):
    embeddings = {}
    for product in products:
        product_id = product["id"]
        # Combine text fields to create a single input string for the model
        text_features = [
            product.get("name", ""),
            product.get("category", ""),
            product.get("company", ""),
            product.get("description", ""),
        ]
        combined_text = " ".join([feature for feature in text_features if feature])  # Join non-empty features
        # Generate embedding for the combined text
        embedding = model.encode(combined_text)
        # Store the embedding
        embeddings[product_id] = embedding
    return embeddings


# function to match similarity
def get_similarity(products, product_embeddings, user_embeddings):
    # Calculate similarity between user products and all products
    recommendations = []
    for product in products:
        product_id = product["id"]
        if product_id in product_embeddings:
            product_vector = np.array([product_embeddings[product_id]])
            similarity = cosine_similarity(user_embeddings, product_vector).mean()
            recommendations.append({
                "id": product_id,
                "name": product["name"],
                "category": product.get("category", ""),
                "company": product.get("company", ""),
                "description": product.get("description", ""),
                "price": product.get("price", 0),
                "stock": product.get("stock", 0),
                "images": product.get("images", []),
                "sellerName": product.get("sellerName", ""),
                "similarity": float(similarity)
            })

    # Sort recommendations by similarity score
    recommendations = sorted(recommendations, key=lambda x: x["similarity"], reverse=True)
    return recommendations


# fetch user cart and previous history products
def fetch_user_data(user_id):
    # get cart products
    cart = Cart.get_cart_items(user_id)
    cart_products = set()
    if cart and "items" in cart:
            cart_products = {
            (item["productId"], item["name"]) for item in cart["items"]
        }
        
    # get previous order products
    orders = Order.get_orders(user_id)
    order_products = set()
    if orders:
        for order in orders:
            if "products" in order:
                order_products.update(
                    (product["productId"], product["name"]) for product in order["products"]
                )

    # unique products list from cart and past orders
    unique_products = cart_products.union(order_products)
    unique_product_list = [
        {"productId": product_id, "name": name} for product_id, name in unique_products
    ]

    return unique_product_list