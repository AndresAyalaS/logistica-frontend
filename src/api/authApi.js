import axios from "axios";
import mockApi from "./mockApi";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Configurar instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para login
// export const loginUser = async (credentials) => {
//   const response = await api.post("/auth/login", credentials);
//   return response.data;
// };

// // Función para registro
// export const registerUser = async (userData) => {
//   const response = await api.post("/auth/register", userData);
//   return response.data;
// };

// // Función para verificar token
// export const verifyToken = async () => {
//   const response = await api.get("/auth/verify");
//   return response.data;
// };



//usando mockApi

// Función para login
export const loginUser = async (credentials) => {
  try {
    const response = await mockApi.login(credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

// Función para registro
export const registerUser = async (userData) => {
  try {
    const response = await mockApi.register(userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Función para verificar token
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    const response = await mockApi.verifyToken(token);
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;
