import axios from 'axios';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [nueva_contrasena, setNueva_contrasena] = useState('');
    const [notification, setNotification] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:4000/api/reset-password', {
                token,
                nueva_contrasena,
            });
            setNotification(response.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            if (error.response) {
                setNotification(`Error: ${error.response.data.message}`);
            } else {
                setNotification('Error al actualizar la contraseña');
            }
        }
    };
    

    return (
        <div className="page-container">
        <Header />
        <div className="form-container">
            <div className="form-box">
                <h2>Restablecer Contraseña</h2>
                {notification && <p className="notification">{notification}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nueva_contrasena" className="form-label">Nueva Contraseña</label>
                    <input
                        type="password"
                        id="nueva_contrasena"
                        className="form-input"
                        placeholder="Ingrese nueva contraseña"
                        value={nueva_contrasena}
                        onChange={(e) => setNueva_contrasena(e.target.value)}
                        required
                    />
                    <button type="submit" className="form-button">Actualizar Contraseña</button>
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

export default ResetPassword;
