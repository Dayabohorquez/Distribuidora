import React, { useState } from 'react';
import '../index.css'; // Asegúrate de que esta ruta sea correcta

const EditPersonalInfoModal = ({ userData, onClose, onSave }) => {
    const [nombre, setNombre] = useState(userData.nombre_usuario);
    const [apellido, setApellido] = useState(userData.apellido_usuario);
    const [email, setEmail] = useState(userData.correo_electronico_usuario);
    const [direccion, setDireccion] = useState(userData.direccion);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            correo_electronico_usuario: email,
            direccion: direccion
        };
        onSave(updatedUser);
        onClose();
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">Editar Información Personal</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="admin-form-label">
                            Nombre:
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="admin-form-input"
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className="admin-form-label">
                            Apellido:
                            <input
                                type="text"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                className="admin-form-input"
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className="admin-form-label">
                            Correo Electrónico:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="admin-form-input"
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className="admin-form-label">
                            Dirección:
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="admin-form-input"
                                required
                            />
                        </label>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">Actualizar Información</button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPersonalInfoModal;
