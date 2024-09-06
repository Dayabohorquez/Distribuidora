// src/components/Login.js
import React, { useState } from 'react';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import { Link } from 'react-router-dom'; 


const Login = () => {
    const [passwordVisible] = useState(false);

    return (
        <div>
            <Header />

            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Iniciar Sesión</h2>
                        <div className="error-message" id="error-message" style={{ display: 'none' }}></div>
                        <form id="login-form" className="form">
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
                                    />
                                </div>
                            </div>
                            <div className="remember-forgot3">
                                <label className="remember-me">
                                    <input type="checkbox" name="rememberMe" /> Recordar contraseña
                                </label>
                                <Link to="#">¿Olvidó su contraseña?</Link>
                            </div>
                            <button type="submit" className="btn0" id="submit-button">Iniciar sesión</button>
                            <div className="login-registerr">
                                <p>¿No tiene una cuenta? <Link to="/register" className="register-link">Registrarse</Link></p>
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
