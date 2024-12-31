"use client";

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditProduct from "./EditProduct";


interface SellerProductsProps {
    sellerName: string;
    refreshCount: number;
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

export default function SellerProducts({ sellerName, refreshCount }: SellerProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const token = useSelector((data: RootState) => data.sellerState.token);

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
                console.error("Failed to fetch seller products:", response.data.error);
            }
        } catch (err: any) {
            console.error("Error fetching seller products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshCount]);

    const handleDeleteProduct = async (productId: string) => {
        try {
            const response = await apiClient.delete(`/seller/removeProduct/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert("Product deleted successfully!");
                fetchProducts(); // Refresh the product list
            } else {
                console.error("Failed to delete product:", response.data.error);
                alert("Failed to delete product.");
            }
        } catch (err: any) {
            console.error("Error deleting product:", err);
            alert("Error deleting product.");
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditProduct(product);
        setIsEditPopupOpen(true);
    };

    const handleCloseEditPopup = () => {
        setEditProduct(null);
        setIsEditPopupOpen(false);
        fetchProducts(); // Refresh the product list after editing
    };

    return (
        <div>
            <h1>Products List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="flex justify-between items-center py-2">
                        <span>{product.name}</span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEditProduct(product)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isEditPopupOpen && editProduct && (
                <EditProduct product={editProduct} onClose={handleCloseEditPopup} />
            )}
        </div>
    );
}
