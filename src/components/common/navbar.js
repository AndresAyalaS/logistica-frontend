// src/components/common/Navbar.js
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <LocalShippingIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              flexGrow: { xs: 1, md: 0 },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            LogiSystem
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/"
                  sx={{ color: 'white', display: 'block' }}
                >
                  Inicio
                </Button>
                <Button
                  component={RouterLink}
                  to="/shipments"
                  sx={{ color: 'white', display: 'block' }}
                >
                  Mis Envíos
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    {user?.username || 'Usuario'}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Iniciar Sesión
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;