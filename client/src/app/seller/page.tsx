"use client"

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { clearSeller } from "../redux/features/sellerSlice";
import SellerDetails from "./components/SellerDetails";
import NotificationsButton from "@/components/NotificationButton";
import "@/styles/globals.css";
import { Button } from "@mui/material";

export default function SellerPage() {
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
      <nav className="bg-custom-light-teal text-black shadow-md px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            <NotificationsButton userId={sellerName} />
            <button
              onClick={() => dispatch(clearSeller())}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <SellerDetails />
    </main>
  );
}