// src/pages/ShipmentsPage.js
import React from 'react';
import ShipmentList from '../components/shipments/ShipmentList';
import { Container } from '@mui/material';

const ShipmentsPage = () => {
  return (
    <Container>
      <ShipmentList />
    </Container>
  );
};

export default ShipmentsPage;