import axios from "axios";

const apiClient = axios.create({
  //baseURL: "http://localhost:5000/api",
  baseURL: "https://e-commerce-application-1-i2ly.onrender.com/api",
  // timeout: 5000, // Timeout
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default apiClient;