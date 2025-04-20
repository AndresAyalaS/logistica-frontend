import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes, createNewRoute } from "../redux/slices/routesSlice";
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
} from "@mui/material";
import Navbar from "../components/common/navbar";

const RoutesPage = () => {
  const dispatch = useDispatch();
  const { routes, loading, error } = useSelector((state) => state.routes);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    start_point: "",
    end_point: "",
    estimated_duration: "",
  });

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createNewRoute(formData));
    handleClose();
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "60%", margin: "2rem auto" }}>
        <h2>Rutas Registradas</h2>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Nueva Ruta
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Origen</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Duración Estimada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(routes) && routes.length > 0 ? (
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.id}</TableCell>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{route.start_point}</TableCell>
                  <TableCell>{route.end_point}</TableCell>
                  <TableCell>
                    {route.estimated_duration} {route.estimated_duration === 1 ? "hora" : "horas"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No hay rutas disponibles.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Crear Ruta</DialogTitle>
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
              label="Origen"
              name="start_point"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Destino"
              name="end_point"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Duración Estimada"
              name="estimated_duration"
              fullWidth
              onChange={handleChange}
            />
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

export default RoutesPage;
