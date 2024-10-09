import React from 'react';
import '../index.css';

const ManageEventoModal = ({ onClose, onSave, eventoData }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Agregar el ID del evento si se está editando
        if (eventoData) {
            formData.append('id_evento', eventoData.id_evento);
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
                <h2>{eventoData ? 'Editar Evento' : 'Crear Evento'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Nombre:
                        <input
                            type="text"
                            name="nombre_evento"
                            defaultValue={eventoData ? eventoData.nombre_evento : ''}
                            required
                            className="admin-form-input"
                        />
                    </label>

                    <label className="admin-form-label">
                        Descripción:
                        <textarea
                            name="descripcion"
                            defaultValue={eventoData ? eventoData.descripcion : ''}
                            required
                            className="admin-form-textarea"
                        />
                    </label>

                    <label className="admin-form-label">
                        Foto (opcional):
                        <input
                            type="file"
                            name="foto_evento"
                            accept="image/*"
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {eventoData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageEventoModal;
