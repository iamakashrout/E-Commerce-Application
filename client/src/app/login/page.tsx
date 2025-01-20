"use client";

import { useState } from "react";
import LoginForm from "../../components/LoginForm";
// import RegisterForm from "../../components/RegisterForm";
import RegisterWithOTP from "@/components/RegisterFormWithOTP";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const router=useRouter();

  const toggleForm = () => setIsRegistering(!isRegistering);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-custom-purple">Welcome to SwiftShop!</h1>
      <div className="p-8 rounded-lg shadow-md w-full max-w-md bg-custom-light-teal">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? "Register" : "Login"}
        </h1>

        {isRegistering ? (
          <RegisterWithOTP />
          // <RegisterForm/>
        ) : (
          <LoginForm />
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
      onClick={()=>{router.push('/seller')}}
      className="fixed bottom-5 right-5 flex items-center justify-center px-4 py-2 bg-custom-pink text-white text-sm font-bold rounded shadow hover:bg-custom-lavender focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
    >
      Login as Seller
    </button>
    </main>
  );
}
