"use client"
import SellerLogin from "@/app/seller/components/SellerLogin";
import SellerRegister from "@/app/seller/components/SellerRegister";
import { useState } from "react";
import "@/styles/globals.css";

export default function SellerLoginPage () {
    const [isRegistering, setIsRegistering] = useState(false);
    
      const toggleForm = () => setIsRegistering(!isRegistering);
    
      return (
        <main className="flex flex-col items-center justify-center min-h-screen">
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
        </main>
      );
}