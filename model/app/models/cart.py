from app.utils.db import db

class CartItem:
    def __init__(self, product_id, quantity, name, price):
        self.product_id = product_id
        self.quantity = quantity
        self.name = name
        self.price = price

class Cart:
    def __init__(self, user_id, items):
        self.user_id = user_id
        self.items = items

    @staticmethod
    def get_cart_items(user_id):
        return db.carts.find_one({"user": user_id})  # Finds the cart for a specific user