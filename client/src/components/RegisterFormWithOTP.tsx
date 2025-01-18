"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const dispatch = useDispatch();

  const handleGenerateOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset previous error
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });

      console.log("OTP Sent:", response.data);
      setOtpSent(true);
      toast.success("OTP sent successfully!", { autoClose: 2000 });
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await apiClient.post("/auth/verifyOtp", {
        name,
        email,
        password,
        phone,
        otp,
      });

      console.log("Registration successful:", response.data);
      const { token, user } = response.data;
      dispatch(setUser({ userEmail: user.email, token: token }));
      toast.success("Registration successful!", { autoClose: 2000 });
      router.push("/");
    } catch (err: any) {
      if(err.status===409){
        toast.error("Invalid OTP!", { autoClose: 2000 });
        return;
      }
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <>
    <ToastContainer />
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

      {otpSent ? (
        <>
          <div>
            <label htmlFor="otp" className="block mb-1 font-bold">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-3 py-2 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-custom-pink text-white px-4 py-2 rounded-md hover:bg-custom-lavender font-bold"
          >
            Register
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={handleGenerateOtp}
          className="bg-custom-pink text-white px-4 py-2 rounded-md hover:bg-custom-lavender font-bold"
        >
          Generate OTP
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
    </>
  );
}
