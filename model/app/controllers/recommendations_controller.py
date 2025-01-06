from flask import jsonify
from app.models.cart import Cart
from app.models.order import Order
from app.models.product import Product
from app.utils.to_string import objectid_to_str

def get_recommendations(user_id):
    try:
        cart = Cart.get_cart_items(user_id)
        if cart:
            cart = objectid_to_str(cart)
        products = Product.get_products()
        if products:
            products = [objectid_to_str(product) for product in products]
        orders = Order.get_orders(user_id)
        if orders:
            orders = [objectid_to_str(order) for order in orders]
        response = {"cart": cart, "products": products, "orders": orders}
        return jsonify({"success": True, "data": response})
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"error": "Error fetching cart items and orders"}