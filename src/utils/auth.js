import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Funciones para gestionar el token
export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Hook useAuth para gestionar la autenticación
export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                // Decodificar el token para obtener la información del usuario
                const decodedToken = jwtDecode(token); // Usa la función correctamente
                setUser(decodedToken);
            } catch (error) {
                console.error("Error decoding token:", error);
                // Opcionalmente, podrías eliminar el token en caso de error
                removeToken();
            }
        }
    }, []);

    return { user };
};
