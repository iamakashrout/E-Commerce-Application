"use client";

import { RootState } from "@/app/redux/store";
import { Product } from "@/types/product";
import apiClient from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditProduct from "./EditProduct";
import SalesData from "./SalesData";
import ReviewData from "./ReviewData";
import ProductCard from "./ProductCard";
import "@/styles/globals.css";

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
    const [isReviewsPopupOpen, setIsReviewsPopupOpen] = useState(false);
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

    const handleViewReviews = (productId: string) => {
        setCurrentProductId(productId);
        setIsReviewsPopupOpen(true);
    };

    const handleCloseReviewsPopup = () => {
        setCurrentProductId(null);
        setIsReviewsPopupOpen(false);
    };

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Products List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewSales={handleViewSales}
                        onViewReviews={handleViewReviews}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </div>

            {isReviewsPopupOpen && currentProductId && (
                <ReviewData productId={currentProductId} onClose={handleCloseReviewsPopup} />
            )}

            {isSalesPopupOpen && currentProductId && (
                <SalesData productId={currentProductId} onClose={handleCloseSalesPopup} />
            )}

            {isEditPopupOpen && editProduct && (
                <EditProduct product={editProduct} onClose={handleCloseEditPopup} />
            )}
        </div>
    );
}