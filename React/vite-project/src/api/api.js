import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: `${backendUrl}/api`,
    withCredentials: true,
})

export default api;
