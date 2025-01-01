"use client";

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditProduct from "./EditProduct";
import SalesData from "./SalesData";


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
    const [isSalesPopupOpen, setIsSalesPopupOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
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

    const handleViewSales = (productId: string) => {
        setCurrentProductId(productId);
        setIsSalesPopupOpen(true);
    };

    const handleCloseSalesPopup = () => {
        setCurrentProductId(null);
        setIsSalesPopupOpen(false);
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Products List</h1>
            <ul className="space-y-6">
                {products.map((product) => (
                    <li key={product.id} className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-white-700">Category: {product.category}</p>
                        <p className="text-white-700">Company: {product.company}</p>
                        <p className="text-white-700">Price: ${product.price}</p>
                        <p className="text-white-700">Stock: {product.stock}</p>

                        {/* Display Product Images */}
                        {product.images.length > 0 ? (
                            <div className="mt-3 flex space-x-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic mt-2">No images available</p>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={() => handleViewSales(product.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                            >
                                View Sales
                            </button>
                            <button
                                onClick={() => handleEditProduct(product)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isSalesPopupOpen && currentProductId && (
                <SalesData productId={currentProductId} onClose={handleCloseSalesPopup} />
            )}

            {isEditPopupOpen && editProduct && (
                <EditProduct product={editProduct} onClose={handleCloseEditPopup} />
            )}
        </div>
    );
}
