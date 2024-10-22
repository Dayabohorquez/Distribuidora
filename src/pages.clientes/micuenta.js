import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import EditPersonalInfoModal from '../components/EditPersonalInfoModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const API_URL = 'http://localhost:4000/api';

const App = () => {
  const [isEditAccountModalOpen, setEditAccountModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isPersonalInfoModalOpen, setPersonalInfoModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(!!decoded.rol);
        fetchUsuario(decoded.documento);
      } catch (e) {
        console.error('Error decodificando el token', e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const fetchUsuario = async (documento) => {
    try {
      const response = await axios.get(`${API_URL}/usuario/${documento}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      showNotification('Error al obtener el usuario.');
    }
  };

  const handleUpdateUsuario = async (updatedUsuario) => {
    if (!userData?.documento) return;

    try {
      const response = await axios.put(`${API_URL}/usuario/${userData.documento}`, updatedUsuario);
      if (response.status === 200) {
        fetchUsuario(userData.documento);
        showNotification('Información actualizada correctamente.');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      showNotification('Error al actualizar el usuario.');
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    if (!userData?.documento) return;

    try {
      const response = await axios.patch(`${API_URL}/usuarios/${userData.documento}/cambiar-contrasena`, {
        oldPassword,
        newPassword
      });
      if (response.status === 200) {
        showNotification('Contraseña cambiada exitosamente.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showNotification('Error al cambiar la contraseña.');
    } finally {
      setChangePasswordModalOpen(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const closeModal = () => {
    setEditAccountModalOpen(false);
    setChangePasswordModalOpen(false);
    setPersonalInfoModalOpen(false);
  };

  return (
    <div>
      {isAuthenticated ? <Headerc /> : <Header onEditAccount={() => setEditAccountModalOpen(true)} onChangePassword={() => setChangePasswordModalOpen(true)} />}
      <main className="container2">
        <h2>
          <Link to="#" className="home-link">
            <i className="fa-solid fa-house"></i>
          </Link> / Tu Cuenta
        </h2>
        <section>
          <p><strong>Detalles de tu cuenta</strong></p>
          <p><Link to="#" onClick={() => setEditAccountModalOpen(true)}>Editar la información de tu cuenta</Link></p>
          <p><Link to="#" onClick={() => setChangePasswordModalOpen(true)}>Cambiar la contraseña</Link></p>
          <p><Link to="#" onClick={() => setPersonalInfoModalOpen(true)}>Ver información personal</Link></p>
          <br /><br />
          <p><strong>Detalles de tus pedidos</strong></p>
          <p><Link to="/orderhistory">Historial</Link></p>
        </section>
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

      {isEditAccountModalOpen && userData && (
        <Modal isOpen={isEditAccountModalOpen} onClose={closeModal}>
          <EditPersonalInfoModal userData={userData} onClose={closeModal} onSave={handleUpdateUsuario} />
        </Modal>
      )}

      {isChangePasswordModalOpen && (
        <Modal isOpen={isChangePasswordModalOpen} onClose={closeModal}>
          <ChangePasswordModal onClose={closeModal} onSave={handleChangePassword} />
        </Modal>
      )}

      {isPersonalInfoModalOpen && userData && (
        <Modal isOpen={isPersonalInfoModalOpen} onClose={closeModal}>
          <h2 className="modal-header">Información Personal</h2>
          <div className="modal-content">
            <p className="modal-detail"><strong>Documento:</strong> {userData.documento}</p>
            <p className="modal-detail"><strong>Nombre:</strong> {userData.nombre_usuario}</p>
            <p className="modal-detail"><strong>Apellido:</strong> {userData.apellido_usuario}</p>
            <p className="modal-detail"><strong>Correo Electrónico:</strong> {userData.correo_electronico_usuario}</p>
            <p className="modal-detail"><strong>Dirección:</strong> {userData.direccion}</p>
          </div>
          <div className="modal-buttons">
            <button className="admin-modal-button" onClick={closeModal}>Cerrar</button>
          </div>
        </Modal>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

const Modal = ({ onClose, children, isOpen }) => (
  <div className={`modal-custom ${isOpen ? 'show' : ''}`} onClick={onClose}>
    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
      <span className="close-custom" onClick={onClose}>&times;</span>
      {children}
    </div>
  </div>
);

export default App;
