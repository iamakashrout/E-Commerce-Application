from app.utils.db import db
import uuid
from datetime import datetime, timezone

# Schema for Selected Product
class SelectedProduct:
    def __init__(self, productId, quantity, name, price):
        self.productId = productId
        self.quantity = quantity
        self.name = name
        self.price = price

# Schema for Order
class Order:
    def __init__(self, user, products, paymentMode, address, subtotal, tax, shipping, discount, grandTotal):
        self.orderId = str(uuid.uuid4())  # Generates a unique order ID
        self.user = user
        self.products = [SelectedProduct(**product) for product in products]
        self.orderDate = datetime.now(timezone.utc)  # Timestamp for the order date
        self.status = "Pending"  # Default status
        self.paymentMode = paymentMode
        self.address = address
        self.total = {
            "subtotal": subtotal,
            "tax": tax,
            "shipping": shipping,
            "discount": discount,
            "grandTotal": grandTotal,
        }

    @staticmethod
    def get_orders(user_id):
        return db.orders.find({"user": user_id})