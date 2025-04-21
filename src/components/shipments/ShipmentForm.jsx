import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewShipment,
  clearShipmentSuccess,
} from "../../redux/slices/shipmentSlice";
import { useNavigate, Link } from "react-router-dom";
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
  Container,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Tooltip,
  StepContent,
  StepConnector,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CategoryIcon from "@mui/icons-material/Category";
import WarningIcon from "@mui/icons-material/Warning";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const productTypes = [
  { value: "Electrónica", icon: "⚡" },
  { value: "Ropa", icon: "👕" },
  { value: "Libros", icon: "📚" },
  { value: "Alimentos", icon: "🍎" },
  { value: "Medicamentos", icon: "💊" },
  { value: "Muebles", icon: "🪑" },
  { value: "Documentos", icon: "📄" },
  { value: "Otros", icon: "📦" },
];

// Pasos personalizados para el componente Stepper
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
  zIndex: 1,
  color: theme.palette.text.secondary,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[2],
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;
  
  const icons = {
    1: <LocationOnIcon />,
    2: <InventoryIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? <CheckCircleIcon /> : icons[String(icon)]}
    </CustomStepIconRoot>
  );
}

// Componente principal
const ShipmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.shipments);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Estados del formulario
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
      isFragile: false,
      specialInstructions: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Validaciones
  const validateAddressStep = () => {
    const newErrors = {};

    if (!formData.originAddress) {
      newErrors.originAddress = "La dirección de origen es obligatoria";
    }

    if (!formData.destinationAddress) {
      newErrors.destinationAddress = "La dirección de destino es obligatoria";
    } else if (formData.originAddress === formData.destinationAddress) {
      newErrors.destinationAddress = "La dirección de destino debe ser diferente a la de origen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePackageStep = () => {
    const newErrors = {};

    if (!formData.packageDetails.weight || formData.packageDetails.weight <= 0) {
      newErrors.weight = "Debe ingresar un peso válido mayor a 0";
    }

    if (!formData.packageDetails.dimensions.length || formData.packageDetails.dimensions.length <= 0) {
      newErrors["dimensions.length"] = "Debe ingresar un largo válido mayor a 0";
    }

    if (!formData.packageDetails.dimensions.width || formData.packageDetails.dimensions.width <= 0) {
      newErrors["dimensions.width"] = "Debe ingresar un ancho válido mayor a 0";
    }

    if (!formData.packageDetails.dimensions.height || formData.packageDetails.dimensions.height <= 0) {
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
    const { name, value, type, checked } = event.target;
    
    // Limpiar el error cuando el campo cambia
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }

    // Manejar diferentes tipos de inputs
    const newValue = type === 'checkbox' ? checked : value;

    if (name.includes(".")) {
      const parts = name.split(".");
      
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: newValue,
          },
        });
      } else if (parts.length === 3) {
        const [parent, middle, child] = parts;
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [middle]: {
              ...formData[parent][middle],
              [child]: newValue,
            },
          },
        });

        // Limpiar errores específicos para dimensiones
        if (errors[`dimensions.${child}`]) {
          setErrors({
            ...errors,
            [`dimensions.${child}`]: null,
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };

  const handleSwapAddresses = () => {
    setFormData({
      ...formData,
      originAddress: formData.destinationAddress,
      destinationAddress: formData.originAddress,
    });
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

  // Renderizado de los pasos del formulario
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.default' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                Información de Dirección
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                    InputProps={{
                      startAdornment: (
                        <LocationOnIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                      ),
                    }}
                    sx={{ mb: 1 }}
                    placeholder="Ej: Calle Principal 123, Ciudad"
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: -1 }}>
                  <Tooltip title="Intercambiar direcciones">
                    <IconButton 
                      onClick={handleSwapAddresses} 
                      color="primary" 
                      sx={{ 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 2,
                        p: 1
                      }}
                    >
                      <SwapHorizIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Dirección de Destino"
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    error={!!errors.destinationAddress}
                    helperText={errors.destinationAddress}
                    InputProps={{
                      startAdornment: (
                        <LocationOnIcon color="error" sx={{ mr: 1 }} fontSize="small" />
                      ),
                    }}
                    placeholder="Ej: Avenida Secundaria 456, Ciudad"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.info.light + '20', borderRadius: 1 }}>
                <Typography variant="body2" color="info.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                  Las direcciones deben ser completas y precisas para garantizar la entrega correcta.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
        
      case 1:
        return (
          <Card elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.default' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                Detalles del Paquete
              </Typography>
              
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
                    InputProps={{
                      startAdornment: (
                        <ScaleIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="product-type-label">Tipo de Producto</InputLabel>
                    <Select
                      labelId="product-type-label"
                      label="Tipo de Producto"
                      name="packageDetails.productType"
                      value={formData.packageDetails.productType}
                      onChange={handleChange}
                      required
                      startAdornment={
                        <CategoryIcon color="action" sx={{ mr: 1 }} fontSize="small" />
                      }
                    >
                      {productTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>{type.icon}</Typography>
                            {type.value}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StraightenIcon sx={{ mr: 1 }} />
                    Dimensiones
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Largo (cm)"
                    name="packageDetails.dimensions.length"
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
                    name="packageDetails.dimensions.width"
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
                    name="packageDetails.dimensions.height"
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
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.packageDetails.isFragile}
                        onChange={handleChange}
                        name="packageDetails.isFragile"
                        color="warning"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon color="warning" sx={{ mr: 1 }} fontSize="small" />
                        <Typography>Contenido frágil - Requiere manejo especial</Typography>
                      </Box>
                    }
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Instrucciones especiales (opcional)"
                    name="packageDetails.specialInstructions"
                    value={formData.packageDetails.specialInstructions}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    placeholder="Indique cualquier instrucción especial para la entrega"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
        
      case 2:
        return (
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: theme.palette.primary.main + '15', p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Confirmar Detalles del Envío
              </Typography>
            </Box>
            
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>
                        <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Información de Dirección
                      </Typography>
                      
                      <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Origen
                        </Typography>
                        <Typography variant="body1" gutterBottom fontWeight="medium">
                          {formData.originAddress}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <ArrowForwardIcon color="action" />
                      </Box>
                      
                      <Box sx={{ p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Destino
                        </Typography>
                        <Typography variant="body1" gutterBottom fontWeight="medium">
                          {formData.destinationAddress}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>
                        <InventoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Detalles del Paquete
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Tipo de Producto</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {productTypes.find(p => p.value === formData.packageDetails.productType)?.icon} {formData.packageDetails.productType}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Peso</Typography>
                          <Typography variant="body1" fontWeight="medium">{formData.packageDetails.weight} kg</Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Dimensiones</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formData.packageDetails.dimensions.length} × {formData.packageDetails.dimensions.width} × {formData.packageDetails.dimensions.height} cm
                          </Typography>
                        </Grid>
                        
                        {formData.packageDetails.isFragile && (
                          <Grid item xs={12}>
                            <Box sx={{ p: 1, bgcolor: theme.palette.warning.light + '30', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                              <WarningIcon color="warning" sx={{ mr: 1 }} fontSize="small" />
                              <Typography variant="body2" color="warning.dark">
                                Contenido frágil - Requiere manejo especial
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        
                        {formData.packageDetails.specialInstructions && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">Instrucciones especiales</Typography>
                            <Typography variant="body1" fontStyle="italic" fontSize="0.9rem">
                              "{formData.packageDetails.specialInstructions}"
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.success.light + '20', borderRadius: 1, mt: 1 }}>
                    <Typography variant="body2" color="success.dark" sx={{ display: 'flex', alignItems: 'center' }}>
                      <InfoIcon sx={{ mr: 1, fontSize: 20 }} />
                      Al crear este envío, acepta nuestros términos y condiciones de servicio. 
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      default:
        return "Unknown step";
    }
  };

  // Renderizado principal
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          to="/shipments"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Crear Nueva Orden de Envío
        </Typography>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 2, 
          mb: 4,
          overflow: 'hidden',
        }}
      >
        {/* Stepper mejorado */}
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          connector={<CustomStepConnector />}
          sx={{ 
            mb: 4,
            pt: 2,
            pb: isMobile ? 0 : 2
          }}
        >
          {["Dirección", "Paquete", "Confirmar"].map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                {label}
              </StepLabel>
              {isMobile && (
                <StepContent>
                  {getStepContent(index)}
                  
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      {index > 0 && (
                        <Button
                          variant="outlined"
                          startIcon={<NavigateBeforeIcon />}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Atrás
                        </Button>
                      )}
                      
                      {index === 2 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                          disabled={loading}
                          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        >
                          {loading ? "Creando..." : "Crear Envío"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          endIcon={<NavigateNextIcon />}
                        >
                          Siguiente
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso actual (sólo visible en desktop) */}
        {!isMobile && (
          <form onSubmit={(e) => e.preventDefault()}>
            {getStepContent(activeStep)}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              {activeStep > 0 ? (
                <Button 
                  onClick={handleBack} 
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                >
                  Atrás
                </Button>
              ) : (
                <Button 
                  component={Link} 
                  to="/shipments"
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                >
                  Cancelar
                </Button>
              )}

              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                  size="large"
                >
                  {loading ? "Creando envío..." : "Confirmar y Crear Envío"}
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNext}
                  endIcon={<NavigateNextIcon />}
                >
                  Siguiente
                </Button>
              )}
            </Box>
          </form>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error ? `Error: ${error}` : "¡Envío creado con éxito!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ShipmentForm;

// Componente de icono de información
function InfoIcon(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
        fill="currentColor"
      />
    </svg>
  );
}