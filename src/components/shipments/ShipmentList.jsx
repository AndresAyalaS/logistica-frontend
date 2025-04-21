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
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../common/navbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

// Componente para mostrar cada envío en pantallas pequeñas
const ShipmentCard = ({ shipment, onViewDetails }) => {
  return (
    <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" component="div">
            {shipment.tracking_number || "Sin número de seguimiento"}
          </Typography>
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
            sx={{ fontWeight: "medium" }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Destino:</strong> {shipment.destination_address
            ? shipment.destination_address.length > 40
              ? `${shipment.destination_address.substring(0, 40)}...`
              : shipment.destination_address
            : "Dirección no disponible"}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          <strong>Fecha:</strong> {shipment.created_at
            ? new Date(shipment.created_at).toLocaleDateString()
            : "Fecha no disponible"}
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            component={Link}
            to={`/shipments/${shipment.id}`}
            variant="outlined"
            size="small"
            onClick={() => onViewDetails(shipment)}
            startIcon={<VisibilityIcon />}
          >
            Detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const ShipmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shipments, loading, error } = useSelector((state) => state.shipments);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(fetchUserShipments());
  }, [dispatch]);

  const handleViewDetails = (shipment) => {
    dispatch(setCurrentShipment(shipment));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Card sx={{ mt: 4, p: 3, borderLeft: `4px solid ${theme.palette.error.main}`, bgcolor: theme.palette.error.light + '20' }}>
          <Typography color="error" variant="h6">
            Error al cargar los envíos
          </Typography>
          <Typography color="error.dark" variant="body2">
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            sx={{ mt: 2 }}
            onClick={() => dispatch(fetchUserShipments())}
          >
            Intentar nuevamente
          </Button>
        </Card>
      );
    }

    if (!shipments || !shipments.length) {
      return (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
          <LocalShippingIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No tienes envíos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Crea tu primer envío para comenzar a gestionar tus pedidos.
          </Typography>
          <Button
            component={Link}
            to="/shipments/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Crear Nuevo Envío
          </Button>
        </Card>
      );
    }

    if (isMobile) {
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="medium">
              Mis Envíos 
              <Chip label={shipments.length} color="primary" size="small" sx={{ ml: 1 }} />
            </Typography>
            <Button
              component={Link}
              to="/shipments/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              size="small"
            >
              Nuevo
            </Button>
          </Box>
          
          {shipments.map((shipment) => (
            <ShipmentCard 
              key={shipment.id} 
              shipment={shipment} 
              onViewDetails={handleViewDetails} 
            />
          ))}
        </>
      );
    }

    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight="medium">
            Mis Envíos 
            <Chip label={shipments.length} color="primary" size="small" sx={{ ml: 1 }} />
          </Typography>
          <Button
            component={Link}
            to="/shipments/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Crear Nuevo Envío
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.primary.main + '22' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Número de Seguimiento</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Destino</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha de Creación</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: 120 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((shipment, index) => (
                <TableRow 
                  key={shipment.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: theme.palette.action.hover 
                    },
                    bgcolor: index % 2 === 0 ? 'inherit' : theme.palette.action.hover + '40',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {shipment.tracking_number || "—"}
                    </Typography>
                  </TableCell>
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
                      sx={{ fontWeight: "medium" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/shipments/${shipment.id}`}
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(shipment)}
                      startIcon={<VisibilityIcon />}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 6 }}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {renderContent()}
        </Paper>
        
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/dashboard")}
            startIcon={<ArrowBackIcon />}
          >
            Regresar al Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ShipmentList;