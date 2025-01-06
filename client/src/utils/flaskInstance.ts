import axios from "axios";

const flaskClient = axios.create({
  baseURL: "http://localhost:8000", // Backend base URL
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

export default flaskClient;