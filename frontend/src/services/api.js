
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ||
        "http://127.0.0.1:8000/api/",
});

// Add access token to protected requests
api.interceptors.request.use(
    (config) => {
        const url = (config.url || "").replace(/^\/+/, "");

        // Don't attach an old token to login or registration
        if (
            url === "accounts/login/" ||
            url === "accounts/register/"
        ) {
            return config;
        }

        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
