import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:4000/api/login', {
                correo_electronico_usuario: email,
                contrasena_usuario: password
            });
    
            console.log('Respuesta del servidor:', response.data);
    
            const { token, usuario } = response.data;
    
            if (usuario && usuario.documento) {
                localStorage.setItem('token', token);
                localStorage.setItem('documento', usuario.documento);
    
                // Crear el carrito después de iniciar sesión
                const responseCarrito = await axios.post('http://localhost:4000/api/carrito/crear', {
                    documento: usuario.documento,
                });
    
                // Guarda el ID del carrito en localStorage
                localStorage.setItem('id_carrito', responseCarrito.data.id_carrito);
    
                switch (usuario.rol_usuario) {
                    case 'Administrador':
                        navigate('/Admin');
                        break;
                    case 'Vendedor':
                        navigate('/VendorDashboard');
                        break;
                    case 'Domiciliario':
                        navigate('/Domiciliary');
                        break;
                    default:
                        navigate('/Myaccount');
                        break;
                }
    
                setNotification('Inicio de sesión exitoso');
                console.log('Notificación de éxito establecida');
                setTimeout(() => setNotification(''), 3000);
            } else {
                throw new Error('Usuario no encontrado en la respuesta');
            }
        } catch (error) {
            setNotification('Error al iniciar sesión. Verifique su correo electrónico y contraseña.');
            console.error(error.response ? error.response.data : error.message);
            setTimeout(() => setNotification(''), 3000);
        }
    };

    return (
        <div>
            <Header />
            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Iniciar Sesión</h2>
                        {notification && <div className="notification">{notification}</div>}
                        <form id="login-form" className="form" onSubmit={handleSubmit}>
                            <div className="input-box1">
                                <label htmlFor="email">Correo</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Ingrese su correo aquí:"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-box1">
                                <label htmlFor="password">Contraseña</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Ingrese su contraseña aquí:"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="remember-forgot3">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        onChange={() => setPasswordVisible(!passwordVisible)}
                                    />
                                    Recordar contraseña
                                </label>
                                <div>
                                    {/* otros elementos del formulario de inicio de sesion */}
                                    <Link to="/request-password-reset">¿Olvidó su contraseña?</Link>
                                </div>
                            </div>
                            <button type="submit" className="btn0" id="submit-button">Iniciar sesión</button>
                            <div className="login-registerr">
                                <p>¿No tiene una cuenta? <Link to="/Register" className="register-link">Registrarse</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
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

export default Login;
