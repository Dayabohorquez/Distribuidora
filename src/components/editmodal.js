import React from 'react';
import '../index.css';

const EditModal = ({ usuario, onClose, onSave }) => {
    // Verificar que el usuario no sea nulo
    if (!usuario) return null;

    const handleSubmit = (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto
        onSave(event);
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">Editar Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Nombre:
                        <input 
                            type="text" 
                            name="campo_nombreU" 
                            className="admin-form-input" 
                            defaultValue={usuario.nombre_usuario} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Apellido:
                        <input 
                            type="text" 
                            name="campo_apellido" 
                            className="admin-form-input" 
                            defaultValue={usuario.apellido_usuario} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Correo:
                        <input 
                            type="email" 
                            name="campo_correo" 
                            className="admin-form-input" 
                            defaultValue={usuario.correo_electronico_usuario} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Dirección:
                        <input 
                            type="text" 
                            name="campo_direccion" 
                            className="admin-form-input" 
                            defaultValue={usuario.direccion} 
                            required 
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">Guardar</button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
