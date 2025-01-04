"use client"

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { clearSeller } from "../redux/features/sellerSlice";
import SellerDetails from "./components/SellerDetails";
import NotificationsButton from "@/components/NotificationButton";

export default function SellerPage () {
    const router = useRouter();
    const isAuth = useSelector((data: RootState) => data.sellerState.isAuthenticated);
    const sellerName = useSelector((data: RootState) => data.sellerState.sellerName);
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (!isAuth) {
        router.push("/seller/login"); // Redirect to login page if not authenticated
      }
    }, [isAuth, router]);
  
    if (!isAuth || !sellerName) {
      return null; // Prevent rendering while redirecting
    }
    
    return (
      <main>
         <h1>Welcome to the Seller Page!</h1>
         <NotificationsButton userId={sellerName} />
         <SellerDetails />
         <button onClick={()=>dispatch(clearSeller())}>LOG OUT</button>
      </main>
    );
}