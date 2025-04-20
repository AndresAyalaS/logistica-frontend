import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserShipments,
  setCurrentShipment,
} from "../../redux/slices/shipmentSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../common/navbar";

// Mapeo de estados para mostrar colores distintos
const statusColors = {
  pending: "warning",
  in_transit: "info",
  delivered: "success",
  canceled: "error",
};

// Mapeo de estados para mostrar en español
const statusLabels = {
  pending: "Pendiente",
  in_transit: "En tránsito",
  delivered: "Entregado",
  canceled: "Cancelado",
};

const ShipmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipments, loading, error } = useSelector((state) => state.shipments);

  useEffect(() => {
    dispatch(fetchUserShipments());
  }, [dispatch]);

  const handleViewDetails = (shipment) => {
    dispatch(setCurrentShipment(shipment));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          Error al cargar los envíos: {error}
        </Typography>
      </Box>
    );
  }

  if (!shipments || !shipments.length) {
    return (
      <><Navbar /><Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          No tienes envíos registrados
        </Typography>
        <Button
          component={Link}
          to="/shipments/create"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Crear Nuevo Envío
        </Button>
      </Box></>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Mis Envíos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de Seguimiento</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>{shipment.tracking_number || "N/A"}</TableCell>
                  <TableCell>
                    {shipment.destination_address
                      ? shipment.destination_address.length > 40
                        ? `${shipment.destination_address.substring(0, 40)}...`
                        : shipment.destination_address
                      : "Dirección no disponible"}
                  </TableCell>
                  <TableCell>
                    {shipment.created_at
                      ? new Date(shipment.created_at).toLocaleDateString()
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        shipment.status && statusLabels[shipment.status]
                          ? statusLabels[shipment.status]
                          : shipment.status || "Desconocido"
                      }
                      color={
                        shipment.status && statusColors[shipment.status]
                          ? statusColors[shipment.status]
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/shipments/${shipment.id}`}
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(shipment)}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/dashboard")}
          >
            Regresar al Dashboard
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ShipmentList;
