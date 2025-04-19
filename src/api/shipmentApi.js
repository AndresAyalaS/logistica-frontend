import {
  generateTrackingNumber,
  calculateShippingCost,
} from "../utils/shipmentUtils";

// Simulación de datos para testing
const mockShipments = [];

// Datos simulados para rutas y transportistas
const mockRoutes = [
  { id: 1, name: "Ruta Norte", start_point: "Almacén Central", end_point: "Zona Norte", estimated_duration: 120 },
  { id: 2, name: "Ruta Sur", start_point: "Almacén Central", end_point: "Zona Sur", estimated_duration: 90 },
  { id: 3, name: "Ruta Este", start_point: "Almacén Central", end_point: "Zona Este", estimated_duration: 60 },
  { id: 4, name: "Ruta Oeste", start_point: "Almacén Central", end_point: "Zona Oeste", estimated_duration: 75 }
];

const mockCarriers = [
  { id: 1, name: "Juan Pérez", vehicle_type: "Furgoneta", capacity: 500, available: true },
  { id: 2, name: "María López", vehicle_type: "Camión", capacity: 1500, available: true },
  { id: 3, name: "Carlos Ruiz", vehicle_type: "Moto", capacity: 50, available: true },
  { id: 4, name: "Ana Gómez", vehicle_type: "Furgoneta", capacity: 450, available: false }
];

// Crear un nuevo envío
export const createShipment = async (shipmentData) => {
  // Simulamos una llamada API con un pequeño delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Validar que la dirección de destino no esté vacía
        if (!shipmentData.destinationAddress) {
          reject({ message: "La dirección de destino es obligatoria" });
          return;
        }

        // Calcular el costo de envío
        const shippingCost = calculateShippingCost(
          shipmentData.packageDetails.weight,
          shipmentData.packageDetails.dimensions
        );

        // Crear objeto de paquete
        const packageObject = {
          id: Date.now() + 1,
          weight: parseFloat(shipmentData.packageDetails.weight),
          dimensions: {
            length: parseFloat(shipmentData.packageDetails.dimensions.length),
            width: parseFloat(shipmentData.packageDetails.dimensions.width),
            height: parseFloat(shipmentData.packageDetails.dimensions.height),
          },
          productType: shipmentData.packageDetails.productType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Crear nuevo envío
        const newShipment = {
          id: Date.now(),
          userId: 1, // Simulamos que proviene del usuario autenticado
          packageId: packageObject.id,
          originAddress: shipmentData.originAddress,
          destinationAddress: shipmentData.destinationAddress,
          status: "pending",
          trackingNumber: generateTrackingNumber(),
          routeId: null,
          carrierId: null,
          estimatedCost: shippingCost.toFixed(2),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          package: packageObject,
        };

        // Crear entrada de historial
        const historyEntry = {
          id: Date.now() + 2,
          shipmentId: newShipment.id,
          status: "pending",
          notes: "Envío registrado en el sistema",
          createdAt: new Date().toISOString(),
        };

        // Guardar todo en el mock
        mockShipments.push({
          ...newShipment,
          history: [historyEntry],
        });

        resolve(newShipment);
      } catch (error) {
        reject({
          message:
            "Error al crear el envío: " +
            (error.message || "Error desconocido"),
        });
      }
    }, 800);
  });
};

// Obtener todos los envíos del usuario
export const getUserShipments = async () => {
  // Simulamos una llamada API con un pequeño delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockShipments);
    }, 500);
  });
};

// Obtener un envío por su ID
export const getShipmentById = async (shipmentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipment = mockShipments.find((s) => s.id === shipmentId);
      if (shipment) {
        resolve(shipment);
      } else {
        reject({ message: "Envío no encontrado" });
      }
    }, 300);
  });
};

// Obtener el historial de estados de un envío
export const getShipmentHistory = async (shipmentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipment = mockShipments.find((s) => s.id === shipmentId);
      if (shipment && shipment.history) {
        resolve(shipment.history);
      } else {
        reject({ message: "Historial de envío no encontrado" });
      }
    }, 300);
  });
};


//asignación de rutas


// Envíos pendientes (sin ruta asignada)
let mockPendingShipments = [
  { 
    id: 101, 
    user_id: 1, 
    package_id: 201, 
    tracking_number: "TRK-101-2023",
    origin_address: "Calle Principal 123", 
    destination_address: "Av. Secundaria 456, Zona Norte", 
    status: "pending",
    created_at: "2023-11-01T10:30:00",
    package: { 
      weight: 25.5, 
      dimensions: { length: 30, width: 20, height: 15 },
      product_type: "Electrónica" 
    }
  },
  { 
    id: 102, 
    user_id: 2, 
    package_id: 202, 
    tracking_number: "TRK-102-2023",
    origin_address: "Av. Principal 789", 
    destination_address: "Calle Secundaria 101, Zona Sur", 
    status: "pending",
    created_at: "2023-11-02T09:15:00",
    package: { 
      weight: 10.2, 
      dimensions: { length: 20, width: 15, height: 10 },
      product_type: "Ropa" 
    }
  },
  { 
    id: 103, 
    user_id: 1, 
    package_id: 203, 
    tracking_number: "TRK-103-2023",
    origin_address: "Calle Comercial 456", 
    destination_address: "Av. Residencial 789, Zona Este", 
    status: "pending",
    created_at: "2023-11-03T14:45:00",
    package: { 
      weight: 5.5, 
      dimensions: { length: 15, width: 10, height: 5 },
      product_type: "Documentos" 
    }
  }
];

// Obtener todos los envíos pendientes
export const getPendingShipments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockPendingShipments });
    }, 800);
  });
};

// Obtener todas las rutas disponibles
export const getRoutes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockRoutes });
    }, 600);
  });
};

// Obtener todos los transportistas
export const getCarriers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: mockCarriers });
    }, 600);
  });
};

// Asignar ruta y transportista a un envío
export const assignRouteToShipment = (shipmentId, routeId, carrierId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Buscar el envío
      const shipmentIndex = mockPendingShipments.findIndex(s => s.id === shipmentId);
      
      if (shipmentIndex === -1) {
        reject({ success: false, message: "Envío no encontrado" });
        return;
      }
      
      // Verificar si la ruta existe
      const route = mockRoutes.find(r => r.id === routeId);
      if (!route) {
        reject({ success: false, message: "Ruta no encontrada" });
        return;
      }
      
      // Verificar si el transportista existe y está disponible
      const carrier = mockCarriers.find(c => c.id === carrierId);
      if (!carrier) {
        reject({ success: false, message: "Transportista no encontrado" });
        return;
      }
      
      if (!carrier.available) {
        reject({ success: false, message: "El transportista no está disponible" });
        return;
      }
      
      // Actualizar el envío
      const updatedShipment = {
        ...mockPendingShipments[shipmentIndex],
        route_id: routeId,
        carrier_id: carrierId,
        status: "in_transit",
        route: route,
        carrier: carrier
      };
      
      // Actualizar la lista de envíos pendientes (eliminar el asignado)
      mockPendingShipments = mockPendingShipments.filter(s => s.id !== shipmentId);
      
      resolve({ success: true, data: updatedShipment });
    }, 1000);
  });
};
