from app.utils.db import db

class CartItem:
    def __init__(self, productId, quantity, name, price):
        self.productId = productId
        self.quantity = quantity
        self.name = name
        self.price = price

class Cart:
    def __init__(self, user, items):
        self.user = user
        self.items = items

    @staticmethod
    def get_cart_items(user_id):
        return db.carts.find_one({"user": user_id})  # Finds the cart for a specific user