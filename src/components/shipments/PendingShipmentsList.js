
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const PendingShipmentsList = ({ shipments, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (shipments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <LocalShippingIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay envíos pendientes de asignación
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table aria-label="tabla de envíos pendientes">
        <TableHead>
          <TableRow>
            <TableCell>ID de Seguimiento</TableCell>
            <TableCell>Origen</TableCell>
            <TableCell>Destino</TableCell>
            <TableCell>Tipo de Producto</TableCell>
            <TableCell>Peso</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha de Creación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell>{shipment.tracking_number}</TableCell>
              <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shipment.origin_address}
              </TableCell>
              <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shipment.destination_address}
              </TableCell>
              <TableCell>{shipment.package.product_type}</TableCell>
              <TableCell>{shipment.package.weight} kg</TableCell>
              <TableCell>
                <Chip 
                  label={shipment.status === 'pending' ? 'En espera' : shipment.status}
                  color={shipment.status === 'pending' ? 'warning' : 'primary'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(shipment.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingShipmentsList;