import React from 'react';
import '../index.css';

const CreateProductModal = ({ onClose, onSave }) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        if (typeof onSave === 'function') {
            onSave(event);
        } else {
            console.error('onSave no es una función', onSave);
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">Crear Producto</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Código:
                        <input type="text" name="campo_codigo" className="admin-form-input" required />
                    </label>
                    <label className="admin-form-label">
                        Nombre:
                        <input type="text" name="campo_nombre" className="admin-form-input" required />
                    </label>
                    <label className="admin-form-label">
                        Descripción:
                        <input type="text" name="campo_descripcion" className="admin-form-input" required />
                    </label>
                    <label className="admin-form-label">
                        Precio:
                        <input type="number" name="campo_precio" className="admin-form-input" required step="0.01" />
                    </label>
                    <label className="admin-form-label">
                        Cantidad Disponible:
                        <input type="number" name="campo_cantidad" className="admin-form-input" required min="1" />
                    </label>
                    <label className="admin-form-label">
                        Tipo de Flor:
                        <input type="number" name="campo_idTipoFlor" className="admin-form-input" required />
                    </label>
                    <label className="admin-form-label">
                        Evento:
                        <input type="number" name="campo_idEvento" className="admin-form-input" required />
                    </label>
                    <label className="admin-form-label">
                        Foto:
                        <input type="file" name="campo_foto" accept="image/*" className="admin-form-input" required />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">Crear</button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
