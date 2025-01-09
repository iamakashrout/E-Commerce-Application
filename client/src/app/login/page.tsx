"use client";

import { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import RegisterWithOTP from "@/components/RegisterFormWithOTP";
import "@/styles/globals.css";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => setIsRegistering(!isRegistering);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
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
    </main>
  );
}
