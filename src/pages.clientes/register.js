import { faEnvelope, faIdCard, faKey, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [documentType, setDocumentType] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate(); // Para redirigir al usuario

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setSuccess('');
            return;
        }

        const requestData = {
            tipo_documento: documentType,
            documento: documentNumber,
            nombre_usuario: name,
            apellido_usuario: lastName,
            correo_electronico_usuario: email,
            contrasena_usuario: password
        };

        console.log('Datos enviados:', requestData);  // Imprime los datos

        try {
            await axios.post('http://localhost:4000/api/register', requestData);
            setSuccess('Cuenta creada exitosamente.');
            setError('');
            // Redirige al login después de un registro exitoso
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Espera 2 segundos antes de redirigir para mostrar el mensaje de éxito
        } catch (error) {
            if (error.response && error.response.data) {
                // Maneja el error con información específica del servidor
                setError(`Error: ${error.response.data.message}`);
            } else {
                // Maneja otros tipos de errores
                setError('Error al registrar la cuenta. Verifique los datos e intente nuevamente.');
            }
            setSuccess('');
            console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <Header />

            <main>
                <div className="form-container">
                    <div className="form-box1 login">
                        <h2>Crear Cuenta</h2>
                        {error && <div className="error-message" style={{ display: 'block' }}>{error}</div>}
                        {success && <div className="success-message" style={{ display: 'block' }}>{success}</div>}
                        <form id="register-form" className="form" onSubmit={handleSubmit}>
                            <div className="input-box1">
                                <label htmlFor="documentType">Tipo de Documento</label>
                                <div className="input-wrapper2">
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faIdCard} />
                                    </span>
                                    <select 
                                        name="documentType" 
                                        id="documentType" 
                                        required
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                        autoFocus
                                    >
                                        <option value="">Seleccione un tipo de documento</option>
                                        <option value="CC">Cédula de ciudadanía</option>
                                        <option value="Pasaporte">Pasaporte</option>
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
                                        value={documentNumber}
                                        onChange={(e) => setDocumentNumber(e.target.value)}
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
                                        onChange={(e) => setName(e.target.value)}
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
                                        onChange={(e) => setLastName(e.target.value)}
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
                                        <button 
                                        type="button" 
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                    </span>
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
                                        <button 
                                        type="button" 
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    >
                                        {confirmPasswordVisible ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                    </span>
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

            <Footer />
        </div>
    );
};

export default Register;
