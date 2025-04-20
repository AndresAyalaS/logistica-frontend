import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAllRoutes = async () => {
  try {
    const response = await axios.get(`${API_URL}/routes`, {
      headers: getAuthHeaders(),
    });
    return response.data.routes;
  } catch (error) {
    console.error("Error al obtener rutas:", error);
    throw new Error(error.response?.data?.message || "Error al obtener rutas");
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/routes/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.route;
  } catch (error) {
    console.error("Error al obtener ruta:", error);
    throw new Error(error.response?.data?.message || "Ruta no encontrada");
  }
};

export const createRoute = async (routeData) => {
  try {
    const response = await axios.post(`${API_URL}/routes`, routeData, {
      headers: getAuthHeaders(),
    });
    return response.data.route;
  } catch (error) {
    console.error("Error al crear ruta:", error);
    throw new Error(error.response?.data?.message || "Error al crear ruta");
  }
};
