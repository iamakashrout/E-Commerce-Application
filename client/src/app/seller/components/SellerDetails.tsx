"use client"

import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux"
import SellerProducts from "./SellerProducts";

export default function SellerDetails () {
    const sellerName = useSelector((data: RootState) => data.sellerState.sellerName);
    const sellerEmail = useSelector((data: RootState) => data.sellerState.sellerEmail);

    if(!sellerName){
        return <p>Seller not found!</p>
    }

    return (
        <div>
            <h1>{sellerName}</h1>
            <h3>{sellerEmail}</h3>
            <SellerProducts sellerName={sellerName} />
        </div>
    )
}