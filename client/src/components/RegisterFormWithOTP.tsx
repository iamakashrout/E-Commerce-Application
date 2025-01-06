import React, { useState } from 'react';
import axios from 'axios';

function RegisterWithOTP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(response.data.message);
      setIsOtpSent(true); // Show OTP input
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || 'Error occurred during registration.');
      } else {
        setMessage('Error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verifyOTP', {
        ...formData,
        otp,
      });
      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || 'Error occurred during OTP verification.');
      } else {
        setMessage('Error occurred during OTP verification.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {!isOtpSent ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterWithOTP;
