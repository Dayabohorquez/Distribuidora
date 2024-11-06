import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');
    const [submitRequest, setSubmitRequest] = useState(false);

    useEffect(() => {
        if (submitRequest) {
            const sendResetRequest = async () => {
                try {
                    const response = await axios.post(
                        'http://localhost:4000/api/request-password-reset',
                        { correo_electronico_usuario: email },
                        { withCredentials: true }
                    );
                    setNotification('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
                } catch (error) {
                    setNotification('Error al enviar el correo de restablecimiento.');
                } finally {
                    setSubmitRequest(false);
                }
            };

            sendResetRequest();
        }
    }, [submitRequest, email]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitRequest(true);
    };

    return (
        <div className="page-container">
            <Header />
            <div className="form-container">
                <div className="form-box">
                    <h2>Recuperar Contraseña</h2>
                    {notification && <div className="notification">{notification}</div>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="form-label">Correo</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="form-button">Enviar</button>
                    </form>
                </div>
            </div>
            <a
                href="https://wa.me/3222118028"
                className="whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaWhatsapp size={30} />
            </a>
            <Footer />
        </div>
    );
    
};

export default RequestPasswordReset;
