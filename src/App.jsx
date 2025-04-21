import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import store from "./redux/store";

//paginas
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import ShipmentsPage from "./pages/shipmentPage";
import ShipmentCreatePage from "./pages/shipmentCreatePage";
import ShipmentDetailPage from "./pages/shipmentDetailPage";
import RoutesPage from './pages/routesPage';
import CarriersPage from './pages/carriersPage';
import AdminShipmentsPage from './pages/adminShipmentsPage';

//componentes
import PrivateRoute from "./components/common/privateRoute";

// Tema de Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3", // Azul
    },
    secondary: {
      main: "#FF9800", // Naranja
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/shipments/create" element={<ShipmentCreatePage />} />
              <Route path="/shipments/:id" element={<ShipmentDetailPage /> } /> 
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/carriers" element={<CarriersPage />} />
              <Route path="/admin-shipments" element={<AdminShipmentsPage />} />
            </Route>

            {/* Redireccionar a login si no hay ruta */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
