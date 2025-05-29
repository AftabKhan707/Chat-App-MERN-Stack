import axios from "axios";

const DB_URL = "https://chat-app-mern-stack-3p3t.onrender.com";

export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: {
    ContentType: "application/json",
  },
});
