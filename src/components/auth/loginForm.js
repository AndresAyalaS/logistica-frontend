import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearError } from "../../redux/slices/authSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client",
  });

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Iniciar Sesión
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
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={Boolean(error)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(error)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="role"
          label="Rol"
          select
          value={formData.role}
          onChange={handleChange}
          error={Boolean(error)}
        >
          <option value="client">Cliente</option>
          <option value="admin">Administrador</option>
        </TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
        </Button>
        <Typography align="center">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginForm;
