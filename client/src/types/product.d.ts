export interface Product {
    id: string;
    name: string;
    company: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images?: string[];
    sellerName: string;
    createdAt: Date;
}