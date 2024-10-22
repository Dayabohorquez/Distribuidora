import React from 'react';
import '../index.css';

const ManageTipoFlorModal = ({ onClose, onSave, tipoFlorData }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Agregar el ID del tipo de flor si se está editando
        if (tipoFlorData) {
            formData.append('id_tipo_flor', tipoFlorData.id_tipo_flor);
        }

        // Llamar a la función onSave pasada como prop
        if (typeof onSave === 'function') {
            onSave(formData);
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2>{tipoFlorData ? 'Editar Tipo de Flor' : 'Crear Tipo de Flor'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Nombre:
                        <input
                            type="text"
                            name="nombre_tipo_flor"
                            defaultValue={tipoFlorData ? tipoFlorData.nombre_tipo_flor : ''}
                            required
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {tipoFlorData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageTipoFlorModal;
