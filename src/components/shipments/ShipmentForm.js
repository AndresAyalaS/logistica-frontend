import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewShipment,
  clearShipmentSuccess,
} from "../../redux/slices/shipmentSlice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

const productTypes = [
  "Electrónica",
  "Ropa",
  "Libros",
  "Alimentos",
  "Medicamentos",
  "Muebles",
  "Documentos",
  "Otros",
];

const steps = ["Información de Dirección", "Detalles del Paquete", "Confirmar"];

const ShipmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.shipments);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    originAddress: "",
    destinationAddress: "",
    packageDetails: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      productType: "Electrónica",
    },
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateAddressStep = () => {
    const newErrors = {};

    if (!formData.originAddress) {
      newErrors.originAddress = "La dirección de origen es obligatoria";
    }

    if (!formData.destinationAddress) {
      newErrors.destinationAddress = "La dirección de destino es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePackageStep = () => {
    const newErrors = {};

    if (
      !formData.packageDetails.weight ||
      formData.packageDetails.weight <= 0
    ) {
      newErrors.weight = "Debe ingresar un peso válido mayor a 0";
    }

    if (
      !formData.packageDetails.dimensions.length ||
      formData.packageDetails.dimensions.length <= 0
    ) {
      newErrors["dimensions.length"] =
        "Debe ingresar un largo válido mayor a 0";
    }

    if (
      !formData.packageDetails.dimensions.width ||
      formData.packageDetails.dimensions.width <= 0
    ) {
      newErrors["dimensions.width"] = "Debe ingresar un ancho válido mayor a 0";
    }

    if (
      !formData.packageDetails.dimensions.height ||
      formData.packageDetails.dimensions.height <= 0
    ) {
      newErrors["dimensions.height"] = "Debe ingresar un alto válido mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = validateAddressStep();
    } else if (activeStep === 1) {
      isValid = validatePackageStep();
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Limpiar el error cuando el campo cambia
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "packageDetails" && child === "dimensions") {
      } else if (name.includes("dimensions.")) {
        const dimension = name.split(".")[1];
        setFormData({
          ...formData,
          packageDetails: {
            ...formData.packageDetails,
            dimensions: {
              ...formData.packageDetails.dimensions,
              [dimension]: value,
            },
          },
        });

        // Limpiar el error cuando cambia una dimensión
        if (errors[`dimensions.${dimension}`]) {
          setErrors({
            ...errors,
            [`dimensions.${dimension}`]: null,
          });
        }
      } else {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validar antes de enviar
    if (activeStep === 2) {
      await dispatch(createNewShipment(formData));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    if (success) {
      dispatch(clearShipmentSuccess());
      navigate("/shipments");
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Dirección de Origen"
                name="originAddress"
                value={formData.originAddress}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={!!errors.originAddress}
                helperText={errors.originAddress}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Dirección de Destino"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                error={!!errors.destinationAddress}
                helperText={
                  errors.destinationAddress ||
                  "La dirección debe ser válida y completa"
                }
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Peso (kg)"
                name="packageDetails.weight"
                type="number"
                value={formData.packageDetails.weight}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 0.1, step: 0.1 }}
                error={!!errors.weight}
                helperText={errors.weight}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="product-type-label">
                  Tipo de Producto
                </InputLabel>
                <Select
                  labelId="product-type-label"
                  label="Tipo de Producto"
                  name="packageDetails.productType"
                  value={formData.packageDetails.productType}
                  onChange={handleChange}
                  required
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Dimensiones
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Largo (cm)"
                name="dimensions.length"
                type="number"
                value={formData.packageDetails.dimensions.length}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1, step: 0.1, max: 9999 }}
                error={!!errors["dimensions.length"]}
                helperText={errors["dimensions.length"]}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Ancho (cm)"
                name="dimensions.width"
                type="number"
                value={formData.packageDetails.dimensions.width}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1, step: 0.1, max: 9999 }}
                error={!!errors["dimensions.width"]}
                helperText={errors["dimensions.width"]}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Alto (cm)"
                name="dimensions.height"
                type="number"
                value={formData.packageDetails.dimensions.height}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1, step: 0.1, max: 9999 }}
                error={!!errors["dimensions.height"]}
                helperText={errors["dimensions.height"]}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resumen del Envío
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Información de Dirección
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Origen:</strong> {formData.originAddress}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Destino:</strong> {formData.destinationAddress}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Detalles del Paquete
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Tipo de Producto:</strong>{" "}
                  {formData.packageDetails.productType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Peso:</strong> {formData.packageDetails.weight} kg
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Dimensiones:</strong>{" "}
                  {formData.packageDetails.dimensions.length} x{" "}
                  {formData.packageDetails.dimensions.width} x{" "}
                  {formData.packageDetails.dimensions.height} cm
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Crear Nueva Orden de Envío
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={(e) => e.preventDefault()}>
        {getStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
              Atrás
            </Button>
          )}

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Crear Envío"}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
        >
          {error ? `Error: ${error}` : "¡Envío creado con éxito!"}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ShipmentForm;
