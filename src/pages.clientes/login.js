import React, { useState } from 'react';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:4000/api/login', { 
                correo_electronico_usuario: email, 
                contrasena_usuario: password 
            });
    
            const { token, Usuario } = response.data;
            localStorage.setItem('token', token);
    
            // Redirigir según el rol
            switch (Usuario.rol_usuario) {
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
                    navigate('/'); // Redirige a la página principal o una página predeterminada
                    break;
            }
    
            setSuccess('Inicio de sesión exitoso');
            setError('');
        } catch (error) {
            setSuccess('');
            setError('Error al iniciar sesión. Verifique su correo electrónico y contraseña.');
            console.error(error);
        }
    };

    return (
        <div>
            <Header />

            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Iniciar Sesión</h2>
                        {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
                        {success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}
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
                                <Link to="#">¿Olvidó su contraseña?</Link>
                            </div>
                            <button type="submit" className="btn0" id="submit-button">Iniciar sesión</button>
                            <div className="login-registerr">
                                <p>¿No tiene una cuenta? <Link to="/Register" className="register-link">Registrarse</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
