// src/pages/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    let userRole = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.rol; 
        } catch (e) {
            localStorage.removeItem('token');
        }
    }

    if (!token || (userRole && !allowedRoles.includes(userRole))) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
