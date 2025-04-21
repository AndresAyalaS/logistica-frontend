import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RouteIcon from "@mui/icons-material/Route";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handleClose();
    setMobileOpen(false);
  };

  // Verificar si la ruta actual coincide con el enlace
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = isAuthenticated ? [
    { text: "Inicio", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Mis Envíos", path: "/shipments", icon: <LocalShippingOutlinedIcon /> },
    { text: "Rutas", path: "/routes", icon: <RouteIcon /> },
    { text: "Transportistas", path: "/carriers", icon: <PeopleIcon /> },
    { text: "Admin Envíos", path: "/admin-shipments", icon: <AdminPanelSettingsIcon /> }
  ] : [];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
        <LocalShippingIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" color="primary" fontWeight="bold">
          LogiSystem
        </Typography>
      </Box>
      <Divider />
      {isAuthenticated ? (
        <>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography variant="subtitle1">{user?.username || "Usuario"}</Typography>
          </Box>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
                selected={isActive(item.path)}
                onClick={() => setMobileOpen(false)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    }
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive(item.path) ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: isActive(item.path) ? 'bold' : 'regular'
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </List>
        </>
      ) : (
        <List>
          <ListItem 
            button 
            component={RouterLink} 
            to="/login"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Iniciar Sesión" />
          </ListItem>
          <ListItem 
            button 
            component={RouterLink} 
            to="/register"
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Registrarse" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Menú móvil */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon 
                sx={{ 
                  mr: 1, 
                  color: 'primary.main',
                  display: { xs: isMobile ? 'none' : 'flex', md: 'flex' }
                }} 
              />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/dashboard"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: "none",
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                LogiSystem
              </Typography>
            </Box>

            {/* Navegación escritorio */}
            {!isMobile && (
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                {isAuthenticated && navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      mx: 0.5,
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(item.path) ? 'bold' : 'regular',
                      backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: isActive(item.path) ? 'primary.light' : 'action.hover',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {/* Menú de usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title={user?.username || "Usuario"}>
                    <IconButton
                      size="large"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="primary"
                    >
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1,
                        width: 200,
                        borderRadius: 2
                      }
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 0.7 }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      {user?.username || "Usuario"}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    component={RouterLink} 
                    to="/register"
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Drawer para móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;