import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShipments, assignRoute } from "../redux/slices/shipmentSlice";
import { fetchRoutes } from "../redux/slices/routesSlice";
import { fetchCarriers } from "../redux/slices/carriersSlice";
import Navbar from "../components/common/navbar";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import RouteIcon from "@mui/icons-material/AltRoute";
import DoneIcon from "@mui/icons-material/Done";

const AdminShipmentsPage = () => {
  const dispatch = useDispatch();
  const { allShipments } = useSelector((state) => state.shipments);
  const { routes } = useSelector((state) => state.routes);
  const { carriers } = useSelector((state) => state.carriers);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [assignments, setAssignments] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = () => {
    dispatch(fetchAllShipments());
    dispatch(fetchRoutes());
    dispatch(fetchCarriers());
  };

  const handleChange = (shipmentId, key, value) => {
    setAssignments((prev) => ({
      ...prev,
      [shipmentId]: {
        ...prev[shipmentId],
        [key]: value,
      },
    }));
  };

  const handleAssign = async (shipmentId) => {
    const { routeId, carrierId } = assignments[shipmentId] || {};

    if (!routeId || !carrierId) {
      setSnackbar({
        open: true,
        message: "Debe seleccionar una ruta y un transportista",
        severity: "warning",
      });
      return;
    }

    try {
      await dispatch(assignRoute({ shipmentId, routeId, carrierId })).unwrap();
      setSnackbar({
        open: true,
        message: "Ruta y transportista asignados correctamente",
        severity: "success",
      });
      dispatch(fetchAllShipments());
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al asignar ruta y transportista",
        severity: "error",
      });
    }
  };

  const handleOpenInfoDialog = (shipment) => {
    setSelectedShipment(shipment);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setSelectedShipment(null);
  };

  const getStatusChip = (status) => {
    const colorMap = {
      "Pendiente": "warning",
      "En tránsito": "info",
      "Entregado": "success",
      "Cancelado": "error",
    };
    return (
      <Chip
        label={status}
        color={colorMap[status] || "default"}
        variant="outlined"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in_transit":
        return "En tránsito";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const filteredShipments = Array.isArray(allShipments)
    ? allShipments.filter((shipment) => {
        const matchesSearch =
          searchTerm === "" ||
          shipment.id.toString().includes(searchTerm) ||
          shipment.origin_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.destination_address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || translateStatus(shipment.status) === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const RenderTableView = () => (
    <Box sx={{ overflowX: "auto", width: "100%" }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableCell width="5%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>ID</TableCell>
            <TableCell width="10%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Usuario</TableCell>
            <TableCell width="20%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Origen</TableCell>
            <TableCell width="20%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Destino</TableCell>
            <TableCell width="10%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Estado</TableCell>
            <TableCell width="15%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Ruta</TableCell>
            <TableCell width="15%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText }}>Transportista</TableCell>
            <TableCell width="15%" sx={{ fontWeight: "bold", color: theme.palette.primary.contrastText, textAlign: "center" }}>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredShipments.length > 0 ? (
            filteredShipments.map((shipment) => {
              const disabled = shipment.status !== "pending";
              return (
                <TableRow 
                  key={shipment.id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>{shipment.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      {shipment.user_id}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={shipment.origin_address} arrow>
                      <Typography noWrap sx={{ maxWidth: "100%" }}>
                        {shipment.origin_address}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={shipment.destination_address} arrow>
                      <Typography noWrap sx={{ maxWidth: "100%" }}>
                        {shipment.destination_address}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{getStatusChip(translateStatus(shipment.status))}</TableCell>
                  <TableCell>
                    <Select
                      value={assignments[shipment.id]?.routeId || ""}
                      onChange={(e) =>
                        handleChange(shipment.id, "routeId", e.target.value)
                      }
                      displayEmpty
                      fullWidth
                      size="small"
                      disabled={disabled}
                    >
                      <MenuItem value="">
                        <em>Seleccionar ruta</em>
                      </MenuItem>
                      {Array.isArray(routes) &&
                        routes.map((route) => (
                          <MenuItem key={route.id} value={route.id}>
                            {route.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={assignments[shipment.id]?.carrierId || ""}
                      onChange={(e) =>
                        handleChange(
                          shipment.id,
                          "carrierId",
                          e.target.value
                        )
                      }
                      displayEmpty
                      fullWidth
                      size="small"
                      disabled={disabled}
                    >
                      <MenuItem value="">
                        <em>Seleccionar transportista</em>
                      </MenuItem>
                      {Array.isArray(carriers) &&
                        carriers
                          .filter((carrier) => carrier.available)
                          .map((carrier) => (
                            <MenuItem key={carrier.id} value={carrier.id}>
                              {carrier.name}
                            </MenuItem>
                          ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Tooltip title="Asignar ruta y transportista">
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAssign(shipment.id)}
                            disabled={disabled}
                            startIcon={<AssignmentIcon />}
                            color="primary"
                          >
                            Asignar
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenInfoDialog(shipment)}
                          color="info"
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: "center", py: 3 }}>
                No hay envíos que coincidan con los criterios de búsqueda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

  const RenderCardView = () => (
    <Grid container spacing={2}>
      {filteredShipments.length > 0 ? (
        filteredShipments.map((shipment) => {
          const disabled = shipment.status !== "pending";
          return (
            <Grid item xs={12} key={shipment.id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" component="div">
                      Envío #{shipment.id}
                    </Typography>
                    {getStatusChip(translateStatus(shipment.status))}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body2">
                        <strong>Usuario:</strong> {shipment.user_id}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                      <PlaceIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main, mt: 0.5 }} />
                      <Typography variant="body2">
                        <strong>Origen:</strong> {shipment.origin_address}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <PlaceIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main, mt: 0.5 }} />
                      <Typography variant="body2">
                        <strong>Destino:</strong> {shipment.destination_address}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {!disabled && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <RouteIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle", color: theme.palette.info.main }} />
                          <strong>Ruta:</strong>
                        </Typography>
                        <Select
                          value={assignments[shipment.id]?.routeId || ""}
                          onChange={(e) => handleChange(shipment.id, "routeId", e.target.value)}
                          displayEmpty
                          fullWidth
                          size="small"
                          disabled={disabled}
                        >
                          <MenuItem value="">
                            <em>Seleccionar ruta</em>
                          </MenuItem>
                          {Array.isArray(routes) &&
                            routes.map((route) => (
                              <MenuItem key={route.id} value={route.id}>
                                {route.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <LocalShippingIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle", color: theme.palette.info.main }} />
                          <strong>Transportista:</strong>
                        </Typography>
                        <Select
                          value={assignments[shipment.id]?.carrierId || ""}
                          onChange={(e) => handleChange(shipment.id, "carrierId", e.target.value)}
                          displayEmpty
                          fullWidth
                          size="small"
                          disabled={disabled}
                        >
                          <MenuItem value="">
                            <em>Seleccionar transportista</em>
                          </MenuItem>
                          {Array.isArray(carriers) &&
                            carriers
                              .filter((carrier) => carrier.available)
                              .map((carrier) => (
                                <MenuItem key={carrier.id} value={carrier.id}>
                                  {carrier.name}
                                </MenuItem>
                              ))}
                        </Select>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                  {!disabled ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAssign(shipment.id)}
                      startIcon={<DoneIcon />}
                      color="primary"
                      fullWidth
                      sx={{ mr: 1 }}
                    >
                      Asignar
                    </Button>
                  ) : (
                    <Box sx={{ flex: 1 }} />
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenInfoDialog(shipment)}
                    startIcon={<InfoIcon />}
                    color="info"
                    sx={{ flex: !disabled ? "0 0 auto" : 1 }}
                  >
                    Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
            <Typography>No hay envíos que coincidan con los criterios de búsqueda.</Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ margin: "2rem auto" }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalShippingIcon sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                  Gestión de Envíos
                </Typography>
              </Box>
              <Tooltip title="Actualizar datos">
                <IconButton color="inherit" onClick={loadData}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, mb: 2 }}>
              <TextField
                placeholder="Buscar por ID, origen o destino..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 }, maxWidth: { md: 400 } }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", justifyContent: { xs: "space-between", md: "flex-end" } }}>
                <Button
                  variant={showFilters ? "contained" : "outlined"}
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ mr: 1 }}
                  size="medium"
                >
                  Filtros
                </Button>
              </Box>
            </Box>

            {showFilters && (
              <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Filtrar por estado:</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip 
                    label="Todos" 
                    onClick={() => setStatusFilter("all")}
                    color={statusFilter === "all" ? "primary" : "default"}
                    variant={statusFilter === "all" ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="Pendiente" 
                    onClick={() => setStatusFilter("Pendiente")}
                    color={statusFilter === "Pendiente" ? "warning" : "default"}
                    variant={statusFilter === "Pendiente" ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="En tránsito" 
                    onClick={() => setStatusFilter("En tránsito")}
                    color={statusFilter === "En tránsito" ? "info" : "default"}
                    variant={statusFilter === "En tránsito" ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="Entregado" 
                    onClick={() => setStatusFilter("Entregado")}
                    color={statusFilter === "Entregado" ? "success" : "default"}
                    variant={statusFilter === "Entregado" ? "filled" : "outlined"}
                  />
                  <Chip 
                    label="Cancelado" 
                    onClick={() => setStatusFilter("Cancelado")}
                    color={statusFilter === "Cancelado" ? "error" : "default"}
                    variant={statusFilter === "Cancelado" ? "filled" : "outlined"}
                  />
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {filteredShipments.length} {filteredShipments.length === 1 ? 'envío encontrado' : 'envíos encontrados'}
              </Typography>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                {isMobile ? <RenderCardView /> : <RenderTableView />}
              </Paper>
            </Box>
          </Paper>
        </Box>

        {/* Info Dialog */}
        <Dialog 
          open={openInfoDialog} 
          onClose={handleCloseInfoDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <InfoIcon sx={{ mr: 1 }} />
              Detalles del Envío #{selectedShipment?.id}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {selectedShipment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Estado del Envío
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getStatusChip(translateStatus(selectedShipment.status))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Información de Origen
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <PlaceIcon fontSize="small" color="error" sx={{ mr: 1, mt: 0.5 }} />
                      <Typography variant="body2">
                        {selectedShipment.origin_address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Información de Destino
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <PlaceIcon fontSize="small" color="success" sx={{ mr: 1, mt: 0.5 }} />
                      <Typography variant="body2">
                        {selectedShipment.destination_address}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Usuario
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body2">
                        ID: {selectedShipment.user_id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {(selectedShipment.route_id || selectedShipment.carrier_id) && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Asignación
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {selectedShipment.route_id && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <RouteIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Typography variant="body2">
                              <strong>Ruta:</strong> {selectedShipment.route_name || `ID: ${selectedShipment.route_id}`}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {selectedShipment.carrier_id && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Typography variant="body2">
                              <strong>Transportista:</strong> {selectedShipment.carrier_name || `ID: ${selectedShipment.carrier_id}`}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoDialog} variant="contained">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default AdminShipmentsPage;