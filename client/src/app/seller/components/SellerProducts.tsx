"use client"

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product"
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

interface SellerProductsProps {
    sellerName: string;
}

function mapProducts(backendProducts: any): Product[] {
    return backendProducts.map((backendProduct: any) => ({
        id: backendProduct.id,
        name: backendProduct.name,
        company: backendProduct.company,
        description: backendProduct.description,
        price: backendProduct.price,
        category: backendProduct.category,
        stock: backendProduct.stock,
        images: backendProduct.images || [],
        sellerName: backendProduct.sellerName,
    }));
}


export default function SellerProducts ({ sellerName }: SellerProductsProps) {
    const [products, setProducts] = useState<Product[]> ([]);
    const token = useSelector((data: RootState) => data.sellerState.token);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get(`/seller/getSellerProducts/${sellerName}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setProducts(mapProducts(response.data.data));
                } else {
                    console.error('Failed to fetch seller products:', response.data.error);
                }
            } catch (err: any) {
                console.error('Error fetching seller products:', err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products List</h1>
            <p>{sellerName}</p>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    )
}