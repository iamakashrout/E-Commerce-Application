import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Backend base URL
  timeout: 5000, // Timeout
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default apiClient;