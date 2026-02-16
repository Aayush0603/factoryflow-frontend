import axios from "axios";

const API = axios.create({
  baseURL: "https://factoryflow-backend-a0vc.onrender.com/api",
});

export default API;