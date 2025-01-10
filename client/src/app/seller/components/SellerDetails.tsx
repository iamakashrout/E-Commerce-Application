"use client"

import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux"
import SellerProducts from "./SellerProducts";
import { useState } from "react";
import AddProduct from "./AddProduct";

export default function SellerDetails() {
    const sellerName = useSelector((data: RootState) => data.sellerState.sellerName);
    const sellerEmail = useSelector((data: RootState) => data.sellerState.sellerEmail);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    if (!sellerName) {
        return <p>Seller not found!</p>
    }

    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);

    const refreshProducts = () => {
        setRefreshCount((prev) => prev + 1);
    };

    return (
        <div>
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-700 mb-2">
                            Seller Name: <span className="text-gray-800">{sellerName}</span>
                        </h1>
                        <h3 className="text-sm font-bold text-gray-600">
                            Email: <span className="text-gray-700">{sellerEmail}</span>
                        </h3>
                    </div>
                    <button
                        className="px-4 py-2 bg-custom-pink text-white rounded shadow hover:bg-custom-lavender focus:outline-none focus:ring focus:ring-blue-300 font-bold transition duration-300"
                        onClick={handleOpenPopup}
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <SellerProducts sellerName={sellerName}  refreshCount={refreshCount} />
            {isPopupOpen && <AddProduct onClose={handleClosePopup} onProductAdded={refreshProducts}  />}
        </div>
    )
}