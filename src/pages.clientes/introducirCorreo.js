import axios from 'axios';
import React, { useState } from 'react';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/request-password-reset', { correo_electronico_usuario: email });
            setNotification('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
        } catch (error) {
        setNotification('Error al enviar el correo de restablecimiento.');
        }
    };

    return (
        <div className="form-container">
            <h2>Recuperar Contraseña</h2>
            {notification && <div className="notification">{notification}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Correo</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingrese su correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default RequestPasswordReset;
