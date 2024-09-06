// src/components/Register.js
import React, { useState } from 'react';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faKey, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Register = () => {
    const [passwordVisible] = useState(false);
    const [confirmPasswordVisible] = useState(false);


    return (
        <div>
            <Header />

            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Crear Cuenta</h2>
                        <div className="error-message" id="error-message" style={{ display: 'none' }}></div>
                        <form id="register-form" className="form">
                            <div className="input-box1">
                                <label htmlFor="documentType">Tipo de Documento</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faIdCard} />
                                    </span>
                                    <select name="documentType" id="documentType" required>
                                        <option value="">Seleccione un tipo de documento</option>
                                        <option value="DNI">DNI</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="Cédula de Extrangería">Cédula de Extrangería</option>
                                        <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-box1">
                                <label htmlFor="documentNumber">Número de Documento</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faKey} />
                                    </span>
                                    <input 
                                        type="text" 
                                        name="documentNumber" 
                                        id="documentNumber" 
                                        placeholder="Ingrese su número de documento aquí:" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-box1">
                                <label htmlFor="name">Nombre</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        placeholder="Ingrese su nombre aquí:" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-box1">
                                <label htmlFor="lastName">Apellido</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        id="lastName" 
                                        placeholder="Ingrese su apellido aquí:" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-box1">
                                <label htmlFor="email">Correo</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
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
                                        name="password" 
                                        id="password" 
                                        placeholder="Ingrese su contraseña aquí:" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="input-box1">
                                <label htmlFor="confirmPassword">Confirmación de contraseña</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <input 
                                        type={confirmPasswordVisible ? 'text' : 'password'} 
                                        name="confirmPassword" 
                                        id="confirmPassword" 
                                        placeholder="Confirme su contraseña aquí:" 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn0">Crear Cuenta</button>
                            <div className="login-registerr">
                                <p>¿Ya tiene una cuenta? <Link to="/login" className="login-registerr">Iniciar sesión</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
