import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const { token } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto
        try {
            // Cambia la URL a la que maneja el restablecimiento de contraseña
            const response = await axios.post('http://localhost:4000/api/reset-password', { 
                token, // Envía el token como parte de la solicitud
                nueva_contrasena: password // Envía la nueva contraseña
            });
            setNotification('Contraseña restablecida exitosamente. Puedes iniciar sesión.');
        } catch (error) {
            setNotification('Error al restablecer la contraseña. Asegúrate de que el token sea válido.');
        }
    };

    return (
        <div className="form-container">
            <h2>Restablecer Contraseña</h2>
            {notification && <div className="notification">{notification}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">Nueva Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ingrese su nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Restablecer</button>
            </form>
        </div>
    );
};

export default ResetPassword;
