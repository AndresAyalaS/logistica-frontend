import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { fetchUserShipments } from "../redux/slices/shipmentSlice";
import Navbar from "../components/common/navbar";

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

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { shipments, loading } = useSelector((state) => state.shipments);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserShipments());
  }, [dispatch]);

  // Obtener los últimos 3 envíos
  const recentShipments = shipments.slice(0, 3);

  // Contadores de envíos por estado
  const pendingCount = shipments.filter((s) => s.status === "pending").length;
  const inTransitCount = shipments.filter(
    (s) => s.status === "in_transit"
  ).length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "delivered"
  ).length;

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido{user?.username ? `, ${user.username}` : ""}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus envíos y sigue su estado desde un solo lugar.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Panel de estadísticas */}
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Resumen de Envíos
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderTop: "4px solid #ff9800",
                height: 140,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" component="h3" color="text.secondary">
                  En Espera
                </Typography>
                <LocalShippingIcon color="warning" />
              </Box>
              <Typography variant="h3" component="p" sx={{ my: 2 }}>
                {loading ? <CircularProgress size={24} /> : pendingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Envíos pendientes de asignación
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderTop: "4px solid #2196f3",
                height: 140,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" component="h3" color="text.secondary">
                  En Tránsito
                </Typography>
                <InventoryIcon color="info" />
              </Box>
              <Typography variant="h3" component="p" sx={{ my: 2 }}>
                {loading ? <CircularProgress size={24} /> : inTransitCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Envíos en proceso de entrega
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderTop: "4px solid #4caf50",
                height: 140,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" component="h3" color="text.secondary">
                  Entregados
                </Typography>
                <CheckCircleOutlineIcon color="success" />
              </Box>
              <Typography variant="h3" component="p" sx={{ my: 2 }}>
                {loading ? <CircularProgress size={24} /> : deliveredCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Envíos completados con éxito
              </Typography>
            </Paper>
          </Grid>

          {/* Acciones rápidas */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Acciones Rápidas
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  component={RouterLink}
                  to="/shipments/create"
                  size="large"
                  sx={{ py: 2 }}
                >
                  Crear Nuevo Envío
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  component={RouterLink}
                  to="/shipments"
                  size="large"
                  sx={{ py: 2 }}
                >
                  Ver Todos los Envíos
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Envíos recientes */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Envíos Recientes
              </Typography>
              <Button component={RouterLink} to="/shipments">
                Ver todos
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentShipments.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
                No tienes envíos registrados. ¡Crea tu primer envío ahora!
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {recentShipments.map((shipment) => (
                  <Grid item xs={12} md={4} key={shipment.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="div"
                            fontWeight="bold"
                          >
                            {shipment.trackingNumber}
                          </Typography>
                          <Chip
                            label={getStatusLabel(shipment.status)}
                            color={getStatusColor(shipment.status)}
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {new Date(shipment.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          gutterBottom
                          noWrap
                          title={shipment.destinationAddress}
                        >
                          <strong>Destino:</strong>{" "}
                          {shipment.destinationAddress}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          <strong>Tipo:</strong> {shipment.package.productType}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/shipments/${shipment.id}`}
                        >
                          Ver Detalles
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
