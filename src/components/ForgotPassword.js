import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/reset-password', { email });
            setNotification('Se ha enviado un enlace de restablecimiento de contraseña a su correo.');
            setTimeout(() => navigate('/login'), 3000); // Redirige después de 3 segundos
        } catch (error) {
            setNotification('Error al enviar el enlace. Verifique su correo electrónico.');
        }
    };

    return (
        <div className="form-container">
            <h2>Restablecer Contraseña</h2>
            {notification && <div className="notification">{notification}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-box1">
                    <label htmlFor="email">Correo</label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn0">Enviar enlace</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
