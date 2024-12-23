// order.d.ts

export interface SelectedProduct {
    productId: string; 
    quantity: number;  
    name: string;     
    price: number;     
  }
  
  export interface Total {
    subtotal: number;  
    tax: number;       
    shipping: number; 
    discount: number; 
    grandTotal: number;
  }
  
  export interface Order {
    orderId: string; 
    user: string; 
    products: SelectedProduct[];
    orderDate: Date; 
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; 
    paymentMode: string; 
    address: string; 
    total: ITotal; 
  }
  