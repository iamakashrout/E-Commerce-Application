"use client"

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { clearSeller } from "../redux/features/sellerSlice";
import SellerDetails from "./components/SellerDetails";

export default function SellerPage () {
    const router = useRouter();
    const isAuth = useSelector((data: RootState) => data.sellerState.isAuthenticated);
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (!isAuth) {
        router.push("/seller/login"); // Redirect to login page if not authenticated
      }
    }, [isAuth, router]);
  
    if (!isAuth) {
      return null; // Prevent rendering while redirecting
    }
    
    return (
      <main>
         <h1>Welcome to the Seller Page!</h1>
         <SellerDetails />
         <button onClick={()=>dispatch(clearSeller())}>LOG OUT</button>
      </main>
    );
}