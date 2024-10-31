import React from 'react';
import '../index.css';

const ManageOptionModal = ({ onClose, onSave, optionData }) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target); // Captura todos los datos del formulario

        if (typeof onSave === 'function') {
            onSave({
                opcion_adicional: formData.get('campo_opcion'),
                precio_adicional: parseFloat(formData.get('campo_precio')),
            }); // Pasa los datos del formulario a la función onSave
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2>{optionData ? 'Editar Opción' : 'Agregar Opción'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Opción Adicional:
                        <input 
                            type="text" 
                            name="campo_opcion" 
                            defaultValue={optionData ? optionData.opcion_adicional : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Precio Adicional:
                        <input 
                            type="number" 
                            name="campo_precio" 
                            defaultValue={optionData ? optionData.precio_adicional : ''} 
                            required 
                            min="0" // Precio no negativo
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {optionData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageOptionModal;
