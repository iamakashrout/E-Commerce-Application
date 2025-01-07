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
      console.log('error', err);
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
      alert('Password changed successfully!');
      onClose(); // Close popup on success
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md lg:max-w-lg xl:max-w-xl text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
        {step === 1 && (
          <>
            <label htmlFor="email" className="block text-lg font-medium mb-2">
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border px-4 py-3 rounded-lg mb-6 text-lg"
              required
            />
            <button
              onClick={handleGenerateOtp}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full text-lg font-medium"
            >
              Generate OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <label htmlFor="otp" className="block text-lg font-medium mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-4 py-3 rounded-lg mb-6 text-lg"
              required
            />
            <label htmlFor="newPassword" className="block text-lg font-medium mb-2">
              Enter New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border px-4 py-3 rounded-lg mb-6 text-lg"
              required
            />
            <button
              onClick={handleResetPassword}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full text-lg font-medium"
            >
              Save
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-500 mt-6 hover:text-gray-800 text-lg font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
