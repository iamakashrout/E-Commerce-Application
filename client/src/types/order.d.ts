// order.d.ts

export interface ISelectedProduct {
    productId: string; 
    quantity: number;  
    name: string;     
    price: number;     
  }
  
  export interface ITotal {
    subtotal: number;  
    tax: number;       
    shipping: number; 
    discount: number; 
    grandTotal: number;
  }
  
  export interface IOrder {
    orderId: string; 
    user: string; 
    products: ISelectedProduct[];
    orderDate: Date; 
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; 
    paymentMode: string; 
    address: string; 
    total: ITotal; 
  }
  