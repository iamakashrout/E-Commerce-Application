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
            <h1>{sellerName}</h1>
            <h3>{sellerEmail}</h3>
            <SellerProducts sellerName={sellerName}  refreshCount={refreshCount} />
            <button onClick={handleOpenPopup}>Add Product</button>
            {isPopupOpen && <AddProduct onClose={handleClosePopup} onProductAdded={refreshProducts}  />}
        </div>
    )
}