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
  Chip
} from "@mui/material";
import { 
  Add as AddIcon, 
  Refresh as RefreshIcon, 
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import Navbar from "../components/common/navbar";

const CarriersPage = () => {
  const dispatch = useDispatch();
  const { carriers, loading, error } = useSelector((state) => state.carriers);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    name: "",
    vehicle_type: "",
    capacity: "",
    available: ""
  });

  useEffect(() => {
    dispatch(fetchCarriers());
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
    dispatch(createNewCarrier(formData))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Transportista creado exitosamente",
          severity: "success"
        });
        setFormData({
          name: "",
          vehicle_type: "",
          capacity: "",
          available: ""
        });
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Error al crear el transportista: " + (err.message || "Error desconocido"),
          severity: "error"
        });
      });
    handleClose();
  };

  const handleRefresh = () => {
    dispatch(fetchCarriers());
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
            <LocalShippingIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              Transportistas Registrados
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refrescar transportistas">
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
              Crear Nuevo Transportista
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
                    <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tipo de vehículo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Capacidad</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(carriers) && carriers.length > 0 ? (
                    carriers.map((carrier) => (
                      <TableRow 
                        key={carrier.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f9f9f9' 
                          },
                          transition: "background-color 0.2s"
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight="medium">{carrier.name}</Typography>
                        </TableCell>
                        <TableCell>{carrier.vehicle_type}</TableCell>
                        <TableCell>{carrier.capacity}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={carrier.available ? <CheckCircleIcon /> : <CancelIcon />}
                            label={carrier.available ? "Disponible" : "No disponible"}
                            color={carrier.available ? "success" : "error"}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">No hay transportistas disponibles.</Typography>
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
            sx: { borderRadius: 2, maxWidth: 500 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5">Crear Nuevo Transportista</Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              margin="dense"
              label="Nombre"
              name="name"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.name}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Tipo de vehículo"
              name="vehicle_type"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.vehicle_type}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Capacidad"
              name="capacity"
              type="number"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={formData.capacity}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="is-available-label">Disponibilidad</InputLabel>
              <Select
                labelId="is-available-label"
                name="available"
                onChange={handleChange}
                label="Disponibilidad"
                value={formData.available}
              >
                <MenuItem value="">
                  <em>Seleccione una opción</em>
                </MenuItem>
                <MenuItem value={true}>Disponible</MenuItem>
                <MenuItem value={false}>No disponible</MenuItem>
              </Select>
            </FormControl>
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
              Guardar Transportista
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

export default CarriersPage;