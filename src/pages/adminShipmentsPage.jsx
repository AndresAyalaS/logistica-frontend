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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllShipments, assignRoute } from "../redux/slices/shipmentSlice";
import { fetchRoutes } from "../redux/slices/routesSlice";
import { fetchCarriers } from "../redux/slices/carriersSlice";
import Navbar from "../components/common/navbar";

const AdminShipmentsPage = () => {
  const dispatch = useDispatch();
  const { allShipments } = useSelector((state) => state.shipments);
  const { routes } = useSelector((state) => state.routes);
  const { carriers } = useSelector((state) => state.carriers);

  const [assignments, setAssignments] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    dispatch(fetchAllShipments());
    dispatch(fetchRoutes());
    dispatch(fetchCarriers());
  }, [dispatch]);

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
      pending: "default",
      in_transit: "info",
      delivered: "success",
      cancelled: "error",
    };
    return (
      <Chip
        label={status.replace("_", " ")}
        color={colorMap[status] || "default"}
        variant="outlined"
        size="small"
      />
    );
  };
  console.log(allShipments);

  return (
    <>
      <Navbar />
      <div style={{ margin: "2rem auto" }}>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Gestión de Envíos
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Ruta</TableCell>
                <TableCell>Transportista</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(allShipments) && allShipments.length > 0 ? (
                allShipments.map((shipment) => {
                  const disabled = shipment.status !== "pending";
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell>{shipment.id}</TableCell>
                      <TableCell>{shipment.user_id}</TableCell>
                      <TableCell>{shipment.origin_address}</TableCell>
                      <TableCell>{shipment.destination_address}</TableCell>
                      <TableCell>{getStatusChip(shipment.status)}</TableCell>
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
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAssign(shipment.id)}
                          disabled={disabled}
                        >
                          Asignar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenInfoDialog(shipment)}
                          sx={{ ml: 1 }}
                        >
                          Info
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    No hay envíos disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Info Dialog */}
          <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
            <DialogTitle>Detalles del Envío</DialogTitle>
            <DialogContent>
              {selectedShipment && (
                <>
                  <Typography variant="subtitle2">
                    Origen: {selectedShipment.origin_address}
                  </Typography>
                  <Typography variant="subtitle2">
                    Destino: {selectedShipment.destination_address}
                  </Typography>
                  <Typography variant="subtitle2">
                    Estado: {getStatusChip(selectedShipment.status)}
                  </Typography>
                  {selectedShipment.route_id && (
                    <Typography variant="subtitle2">
                      Ruta: {selectedShipment.route_name}
                    </Typography>
                  )}
                  {selectedShipment.carrier_id && (
                    <Typography variant="subtitle2">
                      Transportista: {selectedShipment.carrier_name}
                    </Typography>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
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
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </>
  );
};

export default AdminShipmentsPage;
