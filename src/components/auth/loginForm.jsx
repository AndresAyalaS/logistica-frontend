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
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate("/dashboard");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4 },
            maxWidth: 450,
            width: "100%",
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 20px rgba(33, 150, 243, 0.4)",
              }}
            >
              <LoginIcon sx={{ fontSize: 36, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: "#1a237e",
              fontSize: { xs: "1.75rem", sm: "2rem" } 
            }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Fade in={Boolean(error)}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)"
                }}
              >
                {error}
              </Alert>
            </Fade>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(error)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              name="role"
              label="Rol"
              value={formData.role}
              onChange={handleChange}
              error={Boolean(error)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderWidth: 2,
                  }
                }
              }}
            >
              <MenuItem value="client">Cliente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography
                variant="body2"
                component={Link}
                to="/forgot-password"
                sx={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "#0d47a1",
                    textDecoration: "underline",
                  },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 3,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                boxShadow: "0 4px 20px rgba(33, 150, 243, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.6)",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", px: 1 }}>
                o
              </Typography>
            </Divider>

            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: 600,
                  transition: "color 0.2s",
                }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginForm;