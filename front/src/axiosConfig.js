import axios from "axios";

const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5500/api/",
});

export default axiosBase;
