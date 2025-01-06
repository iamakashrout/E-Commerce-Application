from app.utils.db import db
from datetime import datetime, timezone

class Product:
    def __init__(self, id, name, company, description, price, category, stock, sellerName, images=None):
        self.id = id
        self.name = name
        self.company = company
        self.description = description
        self.price = price
        self.category = category
        self.stock = stock
        self.images = images if images else []
        self.sellerName = sellerName
        self.createdAt = datetime.now(timezone.utc)

    @staticmethod
    def get_products():
        return db.products.find()