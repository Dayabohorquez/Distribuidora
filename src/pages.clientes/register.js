import { faEnvelope, faKey, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [documentNumber, setDocumentNumber] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        setNotification('');

        // Validaciones
        const validations = [
            { condition: !documentNumber || !/^\d+$/.test(documentNumber) || documentNumber.length < 6,
                message: 'El número de documento debe contener solo números y tener al menos 6 caracteres.' },
            { condition: !name || !/^(?=.*[A-Za-z])[A-Za-zÁáÉéÍíÓóÚúÑñüÜ\s'-]+$/.test(name),
                message: 'El nombre debe contener solo letras y al menos una letra válida.' },
            { condition: !lastName || !/^(?=.*[A-Za-z])[A-Za-zÁáÉéÍíÓóÚúÑñüÜ\s'-]+$/.test(lastName),
                message: 'El apellido debe contener solo letras y al menos una letra válida.' },
            { condition: !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                message: 'El correo electrónico no es válido.' },
            { condition: !password || !/^(?=.[A-Z])(?=.[a-z])(?=.\d)[A-Za-z\d@$!%?&]{8,}$/.test(password),
                message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.' },
            { condition: password !== confirmPassword,
                message: 'Las contraseñas no coinciden.' },
        ];

        for (const { condition, message } of validations) {
            if (condition) {
                setNotification(message);
                return false;
            }
        }

        return true;
    };

    const handleChangeDocumentNumber = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Solo números
            setDocumentNumber(value);
        }
    };

    const handleChangeName = (e) => {
        const value = e.target.value;
        if (/^[A-Za-zÁáÉéÍíÓóÚúÑñüÜ\s'-]*$/.test(value)) { // Solo letras y caracteres permitidos
            setName(value);
        }
    };

    const handleChangeLastName = (e) => {
        const value = e.target.value;
        if (/^[A-Za-zÁáÉéÍíÓóÚúÑñüÜ\s'-]*$/.test(value)) { // Solo letras y caracteres permitidos
            setLastName(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateForm()) {
            return; 
        }
    
        const requestData = {
            documento: documentNumber,
            nombre_usuario: name,
            apellido_usuario: lastName,
            correo_electronico_usuario: email,
            contrasena_usuario: password
        };
    
        try {
            await axios.post('http://localhost:4000/api/register', requestData);
            setNotification('Cuenta creada exitosamente.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al registrar la cuenta. Verifique los datos e intente nuevamente.';
            setNotification(`Error: ${errorMessage}`);
            console.error('Error en la solicitud:', error);
        }
    };    

    return (
        <div>
            <Header />
            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Crear Cuenta</h2>
                        {notification && <div className="notification">{notification}</div>}
    
                        <form id="register-form" className="form" onSubmit={handleSubmit}>
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
                                        value={documentNumber}
                                        onChange={handleChangeDocumentNumber}
                                        autoFocus
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
                                        value={name}
                                        onChange={handleChangeName}
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
                                        value={lastName}
                                        onChange={handleChangeLastName}
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
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="toggle-password"
                                    >
                                        {passwordVisible ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        placeholder="Ingrese su contraseña aquí:"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
    
                            <div className="input-box1">
                                <label htmlFor="confirmPassword">Confirmación de contraseña</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                        className="toggle-password"
                                    >
                                        {confirmPasswordVisible ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                    <input
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirme su contraseña aquí:"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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

export default Register;