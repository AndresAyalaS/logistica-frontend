
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingShipments } from '../redux/slices/shipmentSlice';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert
} from '@mui/material';
import ShipmentAssignment from '../components/shipments/ShipmentAssignment';
import PendingShipmentsList from '../components/shipments/PendingShipmentsList';

const ShipmentRoutePage = () => {
  const dispatch = useDispatch();
  const { pendingShipments, loading, error } = useSelector(state => state.shipments);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    dispatch(fetchPendingShipments());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Rutas
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Desde esta página puede gestionar la asignación de rutas y transportistas a los envíos pendientes.
          Utilice el formulario para seleccionar un envío, una ruta y un transportista para completar la asignación.
        </Typography>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Asignar Rutas" />
          <Tab label="Envíos Pendientes" />
        </Tabs>
        <Divider />
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <ShipmentAssignment />
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Envíos Pendientes de Asignación
              </Typography>
              <PendingShipmentsList shipments={pendingShipments} loading={loading} />
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipmentRoutePage;