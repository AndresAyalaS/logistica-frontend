import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarriers, createNewCarrier } from "../redux/slices/carriersSlice";
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Navbar from "../components/common/navbar";

const CarriersPage = () => {
  const dispatch = useDispatch();
  const carriers = useSelector((state) => state.carriers.carriers);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    dispatch(fetchCarriers());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createNewCarrier(formData));
    handleClose();
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "70%", margin: "2rem auto" }}>
        <h2>Transportistas Registrados</h2>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Nuevo Transportista
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo de vehiculo</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Disponible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(carriers) && carriers.length > 0 ? (
              carriers.map((carrier) => (
                <TableRow key={carrier.id}>
                  <TableCell>{carrier.name}</TableCell>
                  <TableCell>{carrier.vehicle_type}</TableCell>
                  <TableCell>{carrier.capacity}</TableCell>
                  <TableCell>{carrier.available ? "Sí" : "No"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  No hay transportistas disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Crear Transportista</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nombre"
              name="name"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Tipo de vehiculo"
              name="vehicle_type"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Capacidad"
              name="capacity"
              fullWidth
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="is-active-label">¿Esta disponible?</InputLabel>
              <Select
                labelId="is-active-label"
                name="available"
                onChange={handleChange}
                label="¿Es activo?"
                defaultValue=""
              >
                <MenuItem value="">
                  <em>Seleccione</em>
                </MenuItem>
                <MenuItem value={true}>Sí</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CarriersPage;
