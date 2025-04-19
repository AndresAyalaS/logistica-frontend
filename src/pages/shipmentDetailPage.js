import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShipmentById } from "../api/shipmentApi";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

const getStatusColor = (status) => {
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

const getStatusLabel = (status) => {
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

const ShipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const data = await getShipmentById(parseInt(id));
        setShipment(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!shipment) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No se encontró el envío</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h1">
            Detalles del Envío
          </Typography>
          <Chip
            label={getStatusLabel(shipment.status)}
            color={getStatusColor(shipment.status)}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Número de seguimiento: <strong>{shipment.trackingNumber}</strong>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información de Envío
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Origen:</strong> {shipment.originAddress}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Destino:</strong> {shipment.destinationAddress}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Fecha de creación:</strong>{" "}
                {new Date(shipment.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detalles del Paquete
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tipo de producto:</strong>{" "}
                {shipment.package.productType}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Peso:</strong> {shipment.package.weight} kg
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Dimensiones:</strong>{" "}
                {shipment.package.dimensions.length} x{" "}
                {shipment.package.dimensions.width} x{" "}
                {shipment.package.dimensions.height} cm
              </Typography>
            </Paper>
          </Grid>

          {shipment.routeId && (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Información de Ruta
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Ruta asignada:</strong> {shipment.routeId}
                </Typography>
                {shipment.carrierId && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Transportista:</strong> {shipment.carrierId}
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')} // Redirigir al dashboard
          >
            Regresar al Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipmentDetailPage;
