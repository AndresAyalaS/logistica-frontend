
// Convertir el estado de un envío a un texto legible
export const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "En espera";
    case "in_transit":
      return "En tránsito";
    case "delivered":
      return "Entregado";
    default:
      return "Desconocido";
  }
};

// Obtener el color para un estado de envío
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_transit":
      return "info";
    case "delivered":
      return "success";
    default:
      return "default";
  }
};

// Validar una dirección básica
export const isValidAddress = (address) => {
  return address && address.trim().length >= 5;
};

// Generar un número de seguimiento único
export const generateTrackingNumber = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Calcular el costo estimado de envío basado en peso y dimensiones
export const calculateShippingCost = (weight, dimensions) => {
  // Cálculo simple para simular el costo de envío
  const volumetricWeight =
    (dimensions.length * dimensions.width * dimensions.height) / 5000;
  const calculatedWeight = Math.max(weight, volumetricWeight);

  // Base de costo: $10 + $2 por kg
  return 10 + calculatedWeight * 2;
};
