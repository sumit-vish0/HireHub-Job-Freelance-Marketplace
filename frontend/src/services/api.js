import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});


// Add access token to protected requests
api.interceptors.request.use(
    (config) => {

        // Don't attach old token to login
        if (
            config.url === "accounts/login/" ||
            config.url === "accounts/register/"
        ) {
            return config;
        }

        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;