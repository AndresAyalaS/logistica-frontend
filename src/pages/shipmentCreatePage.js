// src/pages/ShipmentCreatePage.js
import React from 'react';
import ShipmentForm from '../components/shipments/ShipmentForm';
import { Container } from '@mui/material';

const ShipmentCreatePage = () => {
  return (
    <Container>
      <ShipmentForm />
    </Container>
  );
};

export default ShipmentCreatePage;