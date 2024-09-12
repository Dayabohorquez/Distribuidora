// src/components/App.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css'; // Asegúrate de ajustar la ruta a tu archivo CSS

const App = () => {
  const [isEditAccountModalOpen, setEditAccountModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  return (
    <div>
      <Header 
        onEditAccount={() => setEditAccountModalOpen(true)}
        onChangePassword={() => setChangePasswordModalOpen(true)}
      />
      <main className="container2">
        <div>
          <h2>
            <Link to="index.html" className="home-link">
              <i className="fa-solid fa-house"></i>
            </Link> / Tu Cuenta
          </h2>
        </div>
        <div>
          <p><strong>Detalles de tu cuenta</strong></p>
          <p><Link to="#" onClick={() => setEditAccountModalOpen(true)}>Editar la información de tu cuenta</Link></p>
          <p><Link to="#" onClick={() => setChangePasswordModalOpen(true)}>Cambiar la contraseña</Link></p>
          <br /><br />
          <p><strong>Detalles de tus pedidos</strong></p>
          <p><Link to="/orderhistory">Historial</Link></p>
        </div>
      </main>
      <Footer />
      {isEditAccountModalOpen && (
        <div className="modal-custom" onClick={() => setEditAccountModalOpen(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <span className="close-custom" onClick={() => setEditAccountModalOpen(false)}>&times;</span>
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
          </div>
        </div>
      )}
      {isChangePasswordModalOpen && (
        <div className="modal-custom" onClick={() => setChangePasswordModalOpen(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <span className="close-custom" onClick={() => setChangePasswordModalOpen(false)}>&times;</span>
            <h2>Cambiar Contraseña</h2>
            <form>
              <input type="password" placeholder="Contraseña Antigua" required />
              <input type="password" placeholder="Nueva Contraseña" required />
              <input type="password" placeholder="Confirmar Nueva Contraseña" required />
              <button type="submit">Cambiar Contraseña</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
