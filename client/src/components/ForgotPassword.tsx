"use client";

import { useState } from "react";
import apiClient from "@/utils/axiosInstance";

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordPopupProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: OTP and password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleGenerateOtp = async () => {
    setError("");
    setMessage("");
    try {
      const response = await apiClient.post(`/auth/forgotPassword/${email}`);
      setMessage(response.data.message || "OTP sent to your email.");
      setStep(2); // Move to OTP input step
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    try {
      const response = await apiClient.post("/auth/resetPassword", {
        email,
        otp,
        newPassword,
      });
      alert("Password changed successfully!");
      onClose(); // Close popup on success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-custom-light-teal p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl text-black">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        {step === 1 && (
          <>
            <label htmlFor="email" className="block text-sm font-medium mb-2 font-bold">
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border px-4 py-3 rounded-lg mb-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={handleGenerateOtp}
              className="bg-custom-pink text-white px-4 py-3 rounded-lg hover:bg-custom-lavender w-full text-base font-medium transition duration-200"
            >
              Generate OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <label htmlFor="otp" className="block text-sm font-medium mb-2 font-bold">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-4 py-3 rounded-lg mb-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2 font-bold">
              Enter New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border px-4 py-3 rounded-lg mb-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={handleResetPassword}
              className="bg-custom-pink text-white px-4 py-3 rounded-lg hover:bg-custom-lavender w-full text-base font-medium transition duration-200"
            >
              Save
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-500 mt-6 hover:text-gray-800 text-sm font-medium w-full text-center transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
