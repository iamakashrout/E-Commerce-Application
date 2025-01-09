"use client";

import { useState } from "react";
import apiClient from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/features/userSlice";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset previous error
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });

      console.log("Registration successful:", response.data);
      const { token, user } = response.data;
      dispatch(setUser({ userEmail: user.email, token: token }));
      alert("Registration successful!");
      router.push("/"); // Redirect to home page
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-bold">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-bold">
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
        <label htmlFor="password" className="block mb-1 font-bold">
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

      <div>
        <label htmlFor="phone" className="block mb-1 font-bold">
          Phone
        </label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-bold"
      >
        Register
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
