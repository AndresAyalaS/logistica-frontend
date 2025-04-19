import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    // Validación del nombre de usuario
    if (!formData.username) {
      errors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    // Validación del correo electrónico
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }
    
    // Validación de la contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar el error específico cuando el usuario comienza a editar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      const resultAction = await dispatch(register(userData));
      
      if (register.fulfilled.match(resultAction)) {
        navigate('/login');
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Crear Cuenta
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de Usuario"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          error={Boolean(formErrors.username)}
          helperText={formErrors.username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(formErrors.password)}
          helperText={formErrors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar Contraseña"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={Boolean(formErrors.confirmPassword)}
          helperText={formErrors.confirmPassword}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Registrarse'}
        </Button>
        <Typography align="center">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Inicia sesión aquí
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterForm;