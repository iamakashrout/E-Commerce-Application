// order.d.ts

export interface ISelectedProduct {
    productId: string; // Identifier of the product
    quantity: number;  // Quantity of the product
    name: string;      // Name of the product
    price: number;     // Price of the product
  }
  
  export interface ITotal {
    subtotal: number;  // Sum of product prices
    tax: number;       // Tax amount
    shipping: number;  // Shipping charges
    discount: number;  // Discount amount
    grandTotal: number; // Final total after all calculations
  }
  
  export interface IOrder {
    orderId: string; // Unique order identifier
    user: string; // User email or ID associated with the order
    products: ISelectedProduct[]; // Array of selected products
    orderDate: Date; // Date of order placement
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; // Order status
    paymentMode: string; // Payment method (e.g., COD, credit card, etc.)
    address: string; // Shipping address
    total: ITotal; // Total details
  }
  