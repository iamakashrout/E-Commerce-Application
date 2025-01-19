import axios from "axios";

const flaskClient = axios.create({
  //baseURL: "http://localhost:8000", // Backend base URL
  baseURL: "https://e-commerce-application-v6n6.onrender.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default flaskClient;