import axios from "axios";

const API = axios.create({
  baseURL: "https://factoryflow-backend-a0vc.onrender.com/api/public",
});

console.log("BASE URL:", API.defaults.baseURL);

export default API;