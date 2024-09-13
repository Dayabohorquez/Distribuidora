import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).rol : null; // Decodificar el token para obtener el rol

  if (!token || !allowedRoles.includes(userRole)) {
    // Redirigir al login si no hay token o el rol no está permitido
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
