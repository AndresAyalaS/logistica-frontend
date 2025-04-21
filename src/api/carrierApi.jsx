import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAllCarriers = async () => {
  try {
    const response = await axios.get(`${API_URL}/carriers`, {
      headers: getAuthHeaders(),
    });
    return response.data.carriers;
  } catch (error) {
    console.error("Error al obtener transportistas:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener transportistas"
    );
  }
};

export const getCarrierById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/carriers/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.carrier;
  } catch (error) {
    console.error("Error al obtener transportista:", error);
    throw new Error(
      error.response?.data?.message || "Transportista no encontrado"
    );
  }
};

export const createCarrier = async (carrierData) => {
  try {
    const response = await axios.post(`${API_URL}/carriers`, carrierData, {
      headers: getAuthHeaders(),
    });
    return response.data.carrier;
  } catch (error) {
    console.error("Error al crear transportista:", error);
    throw new Error(
      error.response?.data?.message || "Error al crear transportista"
    );
  }
};
