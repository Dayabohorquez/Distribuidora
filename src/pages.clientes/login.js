import React, { useState, useEffect } from 'react';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';
import AddressModal from '../components/AddressModal';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [savedEmails, setSavedEmails] = useState([]); // Estado para guardar correos
    const navigate = useNavigate();

    // Cargar los correos guardados en localStorage al montar el componente
    useEffect(() => {
        const emails = JSON.parse(localStorage.getItem('savedEmails')) || []; // Obtener lista de correos guardados
        setSavedEmails(emails); // Establecer la lista de correos guardados
    }, []);

    // Manejar el cambio en el campo de correo
    const handleEmailChange = (event) => {
        const inputEmail = event.target.value;
        setEmail(inputEmail);

        // Completar la contraseña si el correo ingresado coincide con uno guardado
        const savedPassword = localStorage.getItem('savedPassword');
        if (savedEmails.includes(inputEmail) && savedPassword) {
            setPassword(savedPassword); // Completar la contraseña si hay una guardada
        } else {
            setPassword(''); // Limpiar la contraseña si no hay coincidencia
        }
    };

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

                // Guardar el correo y la contraseña si "Recordar contraseña" está activado
                if (rememberMe) {
                    localStorage.setItem('savedEmail', email);
                    localStorage.setItem('savedPassword', password);

                    // Agregar correo a la lista de correos guardados
                    const emails = JSON.parse(localStorage.getItem('savedEmails')) || [];
                    if (!emails.includes(email)) {
                        emails.push(email);
                        localStorage.setItem('savedEmails', JSON.stringify(emails));
                        setSavedEmails(emails);
                    }
                } else {
                    localStorage.removeItem('savedEmail');
                    localStorage.removeItem('savedPassword');
                }

                // Crear el carrito después de iniciar sesión
                const responseCarrito = await axios.post('http://localhost:4000/api/carrito/crear', {
                    documento: usuario.documento,
                });

                // Guarda el ID del carrito en localStorage
                localStorage.setItem('id_carrito', responseCarrito.data.id_carrito);

                // Verificar si el usuario tiene dirección registrada
                const responseDireccion = await axios.get(`http://localhost:4000/api/${usuario.documento}/direccion`);

                // Guardar el rol del usuario
                setUserRole(usuario.rol_usuario);

                // Si no tiene dirección, mostrar el modal para agregar la dirección
                if (!responseDireccion.data.direccion) {
                    setShowAddressModal(true);
                } else {
                    // Redireccionar según el rol del usuario si ya tiene dirección
                    navigateToRole(usuario.rol_usuario);
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

    const navigateToRole = (role) => {
        switch (role) {
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
    };

    // Función para manejar el cierre del modal
    const handleAddressModalClose = () => {
        setShowAddressModal(false);
        navigateToRole(userRole); // Redirigir después de cerrar el modal
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
                                        placeholder="Ingrese su correo aquí:"
                                        required
                                        value={email}
                                        onChange={handleEmailChange}
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
                                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                    </button>
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
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
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
            <a
                href="https://wa.me/3222118028"
                className="whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaWhatsapp size={30} />
            </a>
            <Footer />
            {showAddressModal && <AddressModal onClose={handleAddressModalClose} />} {/* Modal para agregar dirección */}
        </div>
    );
};

export default Login;
