"use client"
import SellerLogin from "@/app/seller/components/SellerLogin";
import SellerRegister from "@/app/seller/components/SellerRegister";
import { useState } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellerLoginPage () {
    const [isRegistering, setIsRegistering] = useState(false);
    const router=useRouter();
    
      const toggleForm = () => setIsRegistering(!isRegistering);
    
      return (
        <main className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-center text-custom-purple">SwiftShop Seller Portal</h1>
          <div className="bg-custom-light-teal p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {isRegistering ? "Register" : "Login"}
            </h1>
    
            {isRegistering ? (
              <SellerRegister />
            ) : (
              <SellerLogin />
            )}
    
            <p className="mt-4 text-center">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-500 hover:underline"
              >
                {isRegistering ? "Login here" : "Register here"}
              </button>
            </p>
          </div>
          <button
          onClick={()=>{router.push('/')}}
      className="fixed bottom-5 right-5 flex items-center justify-center px-4 py-2 bg-custom-pink text-white text-sm font-bold rounded shadow hover:bg-custom-lavender focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
    >
      Login as Buyer
    </button>
        </main>
      );
}