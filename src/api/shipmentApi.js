import {calculateShippingCost} from "../utils/shipmentUtils";
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Helper para headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Crear un nuevo envío
export const createShipment = async (shipmentData) => {
  try {
    // Validación previa
    if (!shipmentData.destinationAddress) {
      throw new Error("La dirección de destino es obligatoria");
    }

    // Calcular el costo de envío
    const shippingCost = calculateShippingCost(
      shipmentData.packageDetails.weight,
      shipmentData.packageDetails.dimensions
    );

    // Armar el payload para el backend
    const payload = {
      weight: parseFloat(shipmentData.packageDetails.weight),
      dimensions: {
        length: parseFloat(shipmentData.packageDetails.dimensions.length),
        width: parseFloat(shipmentData.packageDetails.dimensions.width),
        height: parseFloat(shipmentData.packageDetails.dimensions.height),
      },
      product_type: shipmentData.packageDetails.productType,
      origin_address: shipmentData.originAddress,
      destination_address: shipmentData.destinationAddress,
    };
    const response = await axios.post(`${API_URL}/shipments`, payload, { headers : getAuthHeaders()});

    return response.data.shipment; 
  } catch (error) {
    console.error("Error al crear el envío:", error);
    throw new Error(error.response?.data?.message || "Error al crear el envío");
  }
};

// Obtener todos los envíos del usuario autenticado
export const getUserShipments = async () => {
  try {
    const response = await fetch(`${API_URL}/shipments`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener los envíos");
    }

    const data = await response.json();
    return data.shipments;
  } catch (error) {
    throw error;
  }
};

// Obtener un envío por su ID
export const getShipmentById = async (shipmentId) => {
  try {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Envío no encontrado");
    }

    const data = await response.json();
    return data.shipment;
  } catch (error) {
    throw error;
  }
};

// Obtener el historial de un envío
export const getShipmentHistory = async (shipmentId) => {
  try {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}/history`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Historial no disponible");
    }

    const data = await response.json();
    return data.history;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los envíos pendientes
export const getPendingShipments = async () => {
  try {
    const response = await fetch(`${API_URL}/shipments/pending`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener los envíos pendientes"
      );
    }

    const data = await response.json();
    return data.shipments;
  } catch (error) {
    throw error;
  }
};

// Asignar ruta y transportista a un envío
export const assignRouteToShipment = async (shipmentId, routeId, carrierId) => {
  try {
    const response = await axios.post(
      `${API_URL}/shipments/${shipmentId}/assign`,
      { routeId, carrierId },
      { headers: getAuthHeaders() }
    );

    return response.data.shipment;
  } catch (error) {
    console.error("Error al asignar ruta al envío:", error);
    throw new Error(
      error.response?.data?.message || "Error al asignar ruta al envío"
    );
  }
};



