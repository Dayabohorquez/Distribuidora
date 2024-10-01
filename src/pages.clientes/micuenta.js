// src/components/App.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css'; // Ajusta la ruta según sea necesario
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [isEditAccountModalOpen, setEditAccountModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(!!decoded.rol); // Verifica si hay un rol
      } catch (e) {
        console.error('Error decodificando el token', e);
        localStorage.removeItem('token');
      }
    }
  }, []);
  
  return (
    <div>
      {isAuthenticated ? <Headerc /> : <Header
        onEditAccount={() => setEditAccountModalOpen(true)}
        onChangePassword={() => setChangePasswordModalOpen(true)}
      />}
      <main className="container2">
        <h2>
          <Link to="index.html" className="home-link">
            <i className="fa-solid fa-house"></i>
          </Link> / Tu Cuenta
        </h2>
        <section>
          <p><strong>Detalles de tu cuenta</strong></p>
          <p><Link to="#" onClick={() => setEditAccountModalOpen(true)}>Editar la información de tu cuenta</Link></p>
          <p><Link to="#" onClick={() => setChangePasswordModalOpen(true)}>Cambiar la contraseña</Link></p>
          <br /><br />
          <p><strong>Detalles de tus pedidos</strong></p>
          <p><Link to="/orderhistory">Historial</Link></p>
        </section>
      </main>
      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/3222118028"
        className="whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} />
      </a>
      <Footer />

      {isEditAccountModalOpen && (
        <Modal onClose={() => setEditAccountModalOpen(false)}>
          <h2>Editar Información de la Cuenta</h2>
          <form>
            <input type="text" placeholder="Tipo de Documento" required />
            <input type="text" placeholder="Número de Documento" required />
            <input type="text" placeholder="Nombre" required />
            <input type="text" placeholder="Apellido" required />
            <input type="email" placeholder="Correo" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar Contraseña" required />
            <button type="submit">Guardar Cambios</button>
          </form>
        </Modal>
      )}

      {isChangePasswordModalOpen && (
        <Modal onClose={() => setChangePasswordModalOpen(false)}>
          <h2>Cambiar Contraseña</h2>
          <form>
            <input type="password" placeholder="Contraseña Antigua" required />
            <input type="password" placeholder="Nueva Contraseña" required />
            <input type="password" placeholder="Confirmar Nueva Contraseña" required />
            <button type="submit">Cambiar Contraseña</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ onClose, children }) => (
  <div className="modal-custom" onClick={onClose}>
    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
      <span className="close-custom" onClick={onClose}>&times;</span>
      {children}
    </div>
  </div>
);

export default App;
