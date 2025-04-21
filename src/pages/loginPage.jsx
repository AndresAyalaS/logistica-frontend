import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import LoginForm from '../components/auth/loginForm';

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;