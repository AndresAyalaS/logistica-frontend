
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPendingShipments,
  assignRoute,
  clearAssignmentStatus 
} from '../../redux/slices/shipmentSlice';

import { fetchRoutes } from '../../redux/slices/routesSlice';
import { fetchCarriers } from '../../redux/slices/carriersSlice';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
  Chip
} from '@mui/material';

const ShipmentAssignment = () => {
  const dispatch = useDispatch();
  const { 
    pendingShipments, 
    routes, 
    carriers, 
    loading, 
    error, 
    assignmentSuccess 
  } = useSelector(state => state.shipments);
  
  const [selectedShipment, setSelectedShipment] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchPendingShipments());
    dispatch(fetchRoutes());
    dispatch(fetchCarriers());
  }, [dispatch]);
  
  useEffect(() => {
    if (assignmentSuccess) {
      setSnackbarOpen(true);
      setSelectedShipment('');
      setSelectedRoute('');
      setSelectedCarrier('');
    }
  }, [assignmentSuccess]);
  
  const handleShipmentChange = (event) => {
    setSelectedShipment(event.target.value);
  };
  
  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
  };
  
  const handleCarrierChange = (event) => {
    setSelectedCarrier(event.target.value);
  };
  
  const handleAssign = () => {
    if (selectedShipment && selectedRoute && selectedCarrier) {
      dispatch(assignRoute({
        shipmentId: selectedShipment,
        routeId: selectedRoute,
        carrierId: selectedCarrier
      }));
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearAssignmentStatus());
  };
  
  // Obtener detalles completos del envío seleccionado
  const selectedShipmentDetails = pendingShipments.find(s => s.id === selectedShipment);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Asignación de Rutas y Transportistas
      </Typography>
      
      {loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seleccionar Envío
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Envío</InputLabel>
                <Select
                  value={selectedShipment}
                  label="Envío"
                  onChange={handleShipmentChange}
                >
                  <MenuItem value=""><em>Seleccione un envío</em></MenuItem>
                  {pendingShipments.map((shipment) => (
                    <MenuItem key={shipment.id} value={shipment.id}>
                      #{shipment.tracking_number} - {shipment.destination_address.substring(0, 20)}...
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedShipmentDetails && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Detalles del envío:</Typography>
                  <Typography variant="body2">Origen: {selectedShipmentDetails.origin_address}</Typography>
                  <Typography variant="body2">Destino: {selectedShipmentDetails.destination_address}</Typography>
                  <Typography variant="body2">
                    Producto: {selectedShipmentDetails.package.product_type}
                  </Typography>
                  <Typography variant="body2">
                    Peso: {selectedShipmentDetails.package.weight} kg
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={selectedShipmentDetails.status === 'pending' ? 'En espera' : selectedShipmentDetails.status} 
                      color={selectedShipmentDetails.status === 'pending' ? 'warning' : 'primary'} 
                      size="small" 
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seleccionar Ruta
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Ruta</InputLabel>
                <Select
                  value={selectedRoute}
                  label="Ruta"
                  onChange={handleRouteChange}
                  disabled={!selectedShipment}
                >
                  <MenuItem value=""><em>Seleccione una ruta</em></MenuItem>
                  {routes.map((route) => (
                    <MenuItem key={route.id} value={route.id}>
                      {route.name} ({route.start_point} → {route.end_point})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedRoute && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Detalles de la ruta:</Typography>
                  {routes.filter(r => r.id === selectedRoute).map(route => (
                    <Box key={route.id}>
                      <Typography variant="body2">Origen: {route.start_point}</Typography>
                      <Typography variant="body2">Destino: {route.end_point}</Typography>
                      <Typography variant="body2">
                        Duración estimada: {route.estimated_duration} minutos
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seleccionar Transportista
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Transportista</InputLabel>
                <Select
                  value={selectedCarrier}
                  label="Transportista"
                  onChange={handleCarrierChange}
                  disabled={!selectedRoute}
                >
                  <MenuItem value=""><em>Seleccione un transportista</em></MenuItem>
                  {carriers
                    .filter(carrier => carrier.available)
                    .map((carrier) => (
                      <MenuItem key={carrier.id} value={carrier.id}>
                        {carrier.name} ({carrier.vehicle_type})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              {selectedCarrier && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Detalles del transportista:</Typography>
                  {carriers.filter(c => c.id === selectedCarrier).map(carrier => (
                    <Box key={carrier.id}>
                      <Typography variant="body2">Nombre: {carrier.name}</Typography>
                      <Typography variant="body2">Vehículo: {carrier.vehicle_type}</Typography>
                      <Typography variant="body2">
                        Capacidad: {carrier.capacity} kg
                      </Typography>
                      <Typography variant="body2">
                        Estado: {carrier.available ? 'Disponible' : 'No disponible'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAssign}
          disabled={!selectedShipment || !selectedRoute || !selectedCarrier || loading}
          sx={{ minWidth: 200 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Asignar Ruta'}
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Asignación de ruta completada con éxito
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShipmentAssignment;