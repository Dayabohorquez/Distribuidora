import React from 'react';
import '../index.css';

const ManageFechaEspecialModal = ({ onClose, onSave, fechaEspecialData }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Agregar el ID de la fecha especial si se está editando
        if (fechaEspecialData) {
            formData.append('id_fecha_especial', fechaEspecialData.id_fecha_especial);
        }

        // Si no hay nueva foto, no se añade al formData
        if (!formData.get('foto')) {
            formData.delete('foto');
        }

        if (typeof onSave === 'function') {
            onSave(formData);
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2>{fechaEspecialData ? 'Editar Fecha Especial' : 'Crear Fecha Especial'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Nombre:
                        <input
                            type="text"
                            name="nombre_fecha_especial"
                            defaultValue={fechaEspecialData ? fechaEspecialData.nombre_fecha_especial : ''}
                            required
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {fechaEspecialData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageFechaEspecialModal;
