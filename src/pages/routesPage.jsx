import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
} from "@mui/material";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    start_point: "",
    end_point: "",
    estimated_duration: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchRoutes = async () => {
    const res = await axios.get("/api/routes");
    setRoutes(res.data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`/api/routes/${editingId}`, form);
    } else {
      await axios.post("/api/routes", form);
    }
    setForm({
      name: "",
      start_point: "",
      end_point: "",
      estimated_duration: "",
    });
    setEditingId(null);
    fetchRoutes();
  };

  const handleEdit = (route) => {
    setForm(route);
    setEditingId(route.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/routes/${id}`);
    fetchRoutes();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Rutas
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Punto de Inicio"
          name="start_point"
          value={form.start_point}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Punto Final"
          name="end_point"
          value={form.end_point}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Duración Estimada (h)"
          name="estimated_duration"
          type="number"
          value={form.estimated_duration}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          {editingId ? "Actualizar Ruta" : "Agregar Ruta"}
        </Button>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Duración (h)</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.start_point}</TableCell>
                <TableCell>{route.end_point}</TableCell>
                <TableCell>{route.estimated_duration}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(route)} size="small">
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(route.id)}
                    size="small"
                    color="error"
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default RoutesPage;
