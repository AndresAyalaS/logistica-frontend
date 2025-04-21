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
  Paper,
  Box,
  Typography,
  TableContainer,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Stack,
  Fab
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon, EditRoad as EditRoadIcon } from "@mui/icons-material";
import Navbar from "../components/common/navbar";

const RoutesPage = () => {
  const dispatch = useDispatch();
  const { routes, loading, error } = useSelector((state) => state.routes);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
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
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    dispatch(createNewRoute(formData))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Ruta creada exitosamente",
          severity: "success"
        });
        setFormData({
          name: "",
          start_point: "",
          end_point: "",
          estimated_duration: "",
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error al crear la ruta: " + (err.message || "Error desconocido"),
          severity: "error"
        });
      });
    handleClose();
  };

  const handleRefresh = () => {
    dispatch(fetchRoutes());
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          maxWidth: 1200, 
          mx: "auto", 
          px: 3, 
          py: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <EditRoadIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              Rutas Registradas
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refrescar rutas">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleOpen}
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2 }}
            >
              Crear Nueva Ruta
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Origen</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Destino</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Duración Estimada</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(routes) && routes.length > 0 ? (
                    routes.map((route) => (
                      <TableRow 
                        key={route.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f9f9f9' 
                          },
                          transition: "background-color 0.2s"
                        }}
                      >
                        <TableCell>{route.id}</TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">{route.name}</Typography>
                        </TableCell>
                        <TableCell>{route.start_point}</TableCell>
                        <TableCell>{route.end_point}</TableCell>
                        <TableCell>
                          <Typography>
                            {route.estimated_duration} {route.estimated_duration === 1 ? "hora" : "horas"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">No hay rutas disponibles.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Dialog 
          open={open} 
          onClose={handleClose}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5">Crear Nueva Ruta</Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              margin="dense"
              label="Nombre de la ruta"
              name="name"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.name}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Punto de origen"
              name="start_point"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.start_point}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Punto de destino"
              name="end_point"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.end_point}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Duración estimada (horas)"
              name="estimated_duration"
              type="number"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.estimated_duration}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Guardar Ruta
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleSnackbarClose}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default RoutesPage;