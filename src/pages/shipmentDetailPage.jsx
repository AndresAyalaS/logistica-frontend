import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Card,
  CardContent,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapIcon from "@mui/icons-material/Map";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Estados del envío y sus colores
const statuses = {
  pending: {
    color: "warning",
    label: "En espera",
    step: 0,
  },
  processing: {
    color: "info",
    label: "Procesando",
    step: 1,
  },
  in_transit: {
    color: "info",
    label: "En tránsito",
    step: 2,
  },
  out_for_delivery: {
    color: "info",
    label: "En reparto",
    step: 3,
  },
  delivered: {
    color: "success",
    label: "Entregado",
    step: 4,
  },
  canceled: {
    color: "error",
    label: "Cancelado",
    step: -1,
  },
};

// Obtener información de estado
const getStatusInfo = (status) => {
  return statuses[status] || { color: "default", label: "Desconocido", step: 0 };
};

// Componente para mostrar la cronología del envío
const ShipmentTimeline = ({ status }) => {
  const statusInfo = getStatusInfo(status);
  
  // Si el envío está cancelado, mostramos un mensaje especial
  if (status === "canceled") {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        Este envío ha sido cancelado y no será procesado.
      </Alert>
    );
  }

  return (
    <Stepper activeStep={statusInfo.step} alternativeLabel sx={{ mt: 3, mb: 3 }}>
      <Step completed={statusInfo.step >= 0}>
        <StepLabel>Registrado</StepLabel>
      </Step>
      <Step completed={statusInfo.step >= 1}>
        <StepLabel>Procesando</StepLabel>
      </Step>
      <Step completed={statusInfo.step >= 2}>
        <StepLabel>En tránsito</StepLabel>
      </Step>
      <Step completed={statusInfo.step >= 3}>
        <StepLabel>En reparto</StepLabel>
      </Step>
      <Step completed={statusInfo.step >= 4}>
        <StepLabel>Entregado</StepLabel>
      </Step>
    </Stepper>
  );
};

// Componente para mostrar un campo de información
const InfoField = ({ icon, label, value, isImportant = false }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Box sx={{ mr: 2, color: "text.secondary" }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: isImportant ? "medium" : "regular",
            color: isImportant ? "text.primary" : "inherit"
          }}
        >
          {value || "No disponible"}
        </Typography>
      </Box>
    </Box>
  );
};

const ShipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Envío #${shipment.tracking_number}`,
        text: `Detalles del envío ${shipment.tracking_number}`,
        url: window.location.href,
      }).catch((error) => console.log('Error al compartir', error));
    } else {
      // Fallback para navegadores que no soportan la API Web Share
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh" }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando detalles del envío...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h6" gutterBottom>Error al cargar los detalles</Typography>
          <Typography variant="body1">{error}</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/shipments')}
          >
            Volver a la lista de envíos
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!shipment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="info" 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <Typography variant="h6" gutterBottom>Envío no encontrado</Typography>
          <Typography variant="body1">No se pudo encontrar información para el envío solicitado.</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
            onClick={() => navigate('/shipments')}
          >
            Volver a la lista de envíos
          </Button>
        </Alert>
      </Container>
    );
  }

  const statusInfo = getStatusInfo(shipment.status);

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 6, position: "relative" }}>
      {/* Migas de pan */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2, display: { xs: 'none', sm: 'flex' } }}
      >
        <Button 
          component={Link} 
          to="/dashboard"
          startIcon={<HomeIcon />}
          sx={{ textTransform: 'none' }}
        >
          Dashboard
        </Button>
        <Button 
          component={Link} 
          to="/shipments"
          startIcon={<LocalShippingIcon />}
          sx={{ textTransform: 'none' }}
        >
          Mis Envíos
        </Button>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <InventoryIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Envío #{shipment.tracking_number}
        </Typography>
      </Breadcrumbs>

      {/* Botón de regreso en móviles */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/shipments')}
          variant="outlined"
          size="small"
        >
          Volver
        </Button>
      </Box>

      {/* Contenido principal */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {/* Encabezado */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom={isMobile}>
              Envío #{shipment.tracking_number}
            </Typography>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary">
                Creado el {new Date(shipment.created_at).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mt: isMobile ? 1 : 0, display: 'flex', alignItems: 'center' }}>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              sx={{ 
                fontWeight: "medium", 
                mr: 1, 
                fontSize: "0.9rem",
                py: 0.5,
                px: 1
              }}
            />
            <Tooltip title="Imprimir detalles">
              <IconButton onClick={handlePrint} size="small" sx={{ ml: 1 }}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir">
              <IconButton onClick={handleShare} size="small" sx={{ ml: 1 }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Cronología del envío */}
        <Card sx={{ mb: 3, bgcolor: theme.palette.background.default, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estado del envío
            </Typography>
            <ShipmentTimeline status={shipment.status} />
            {shipment.status === "in_transit" && (
              <Typography variant="body2" color="text.secondary" align="center">
                Tiempo estimado de entrega: 2-3 días hábiles
              </Typography>
            )}
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Información detallada */}
        <Grid container spacing={3}>
          {/* Información de Envío */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1 }} />
                  Información de Envío
                </Typography>
                
                <InfoField 
                  icon={<EventIcon />} 
                  label="Fecha de creación" 
                  value={new Date(shipment.created_at).toLocaleString()} 
                />
                
                <InfoField 
                  icon={<LocationOnIcon color="error" />} 
                  label="Origen" 
                  value={shipment.origin_address} 
                  isImportant
                />
                
                <InfoField 
                  icon={<LocationOnIcon color="success" />} 
                  label="Destino" 
                  value={shipment.destination_address} 
                  isImportant
                />
                
                {shipment.estimated_delivery && (
                  <InfoField 
                    icon={<EventIcon />} 
                    label="Entrega estimada" 
                    value={new Date(shipment.estimated_delivery).toLocaleDateString()} 
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Detalles del Paquete */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <InventoryIcon sx={{ mr: 1 }} />
                  Detalles del Paquete
                </Typography>
                
                <InfoField 
                  icon={<InventoryIcon />} 
                  label="Tipo de producto" 
                  value={shipment.product_type} 
                  isImportant
                />
                
                <InfoField 
                  icon={<ScaleIcon />} 
                  label="Peso" 
                  value={`${shipment.weight} kg`} 
                />
                
                <InfoField 
                  icon={<StraightenIcon />} 
                  label="Dimensiones" 
                  value={`${shipment.dimensions.length} × ${shipment.dimensions.width} × ${shipment.dimensions.height} cm`} 
                />

                {shipment.fragile && (
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label="Frágil: Manipular con cuidado" 
                      color="error" 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Información de Ruta */}
          {shipment.routeId && (
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <MapIcon sx={{ mr: 1 }} />
                    Información de Ruta
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InfoField 
                        icon={<MapIcon />} 
                        label="Ruta asignada" 
                        value={`#${shipment.routeId}`} 
                      />
                    </Grid>
                    
                    {shipment.carrierId && (
                      <Grid item xs={12} sm={6}>
                        <InfoField 
                          icon={<PersonIcon />} 
                          label="Transportista" 
                          value={`#${shipment.carrierId}`} 
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
        
        {/* Botones de acción */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/shipments')}
          >
            Volver a mis envíos
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipmentDetailPage;