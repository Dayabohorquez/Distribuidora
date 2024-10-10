import React, { useState } from 'react';
import '../index.css'; // Asegúrate de que esta ruta sea correcta

const ChangePasswordModal = ({ onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateNewPassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }
    return null; // Sin errores
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    setErrorMessage(''); // Limpiar mensaje de error
    onSave(oldPassword, newPassword);
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <span className="admin-modal-close" onClick={onClose}>&times;</span>
        <h2 className="admin-modal-header">Cambiar Contraseña</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label className="admin-form-label">
              Contraseña Antigua:
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="admin-form-input"
                required
              />
            </label>
          </div>
          <div>
            <label className="admin-form-label">
              Contraseña Nueva:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-form-input"
                required
              />
            </label>
          </div>
          <div>
            <label className="admin-form-label">
              Confirmar Nueva Contraseña:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-form-input"
                required
              />
            </label>
          </div>
          <div className="modal-buttons">
            <button type="submit" className="admin-modal-button">Cambiar Contraseña</button>
            <button type="button" className="admin-modal-button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
