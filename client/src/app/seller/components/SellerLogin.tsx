"use client";

import { useState } from "react";
import apiClient from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setSeller } from "@/app/redux/features/sellerSlice";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset previous error
    try {
      const response = await apiClient.post("/seller/sellerLogin", { email, password });

      console.log("Login successful:", response.data);
      const { token, seller } = response.data;
      dispatch(setSeller({sellerName: seller.name, sellerEmail: seller.email, token: token}));
      alert("Login successful!");
      router.push('/seller');
      // if (onSuccess) onSuccess(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Login
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
