import axios from "axios";

const API = axios.create({
  baseURL: "https://factoryflow-backend-a0vc.onrender.com/api/public",
});

export default API;