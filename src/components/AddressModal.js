import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; // Asegúrate de que esta ruta sea correcta

const AddressModal = ({ onClose }) => {
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!address.trim()) {
            setErrorMessage('La dirección no puede estar vacía.');
            return;
        }
        try {
            const documento = localStorage.getItem('documento');
            await axios.post(`http://localhost:4000/api/usuarios/${documento}/direccion`, {
                direccion: address,
            });
            onClose(); // Cerrar el modal después de agregar la dirección
        } catch (error) {
            setErrorMessage('Error al guardar la dirección. Intente de nuevo.');
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">Agregar Dirección</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="admin-form-label">
                            Dirección:
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="admin-form-input"
                                required
                            />
                        </label>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">Guardar</button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
