import axios from "axios";

const flaskClient = axios.create({
  baseURL: "http://localhost:8000", // Backend base URL
  timeout: 5000, // Timeout
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default flaskClient;