import React from 'react';
import '../index.css';

const ManageOrderModal = ({ onClose, onSave, orderData }) => {
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target); // Captura todos los datos del formulario

        if (typeof onSave === 'function') {
            onSave(formData); // Pasa los datos del formulario a la función onSave
        }
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2>{orderData ? 'Editar Pedido' : 'Crear Pedido'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Fecha:
                        <input 
                            type="date" 
                            name="campo_fecha" 
                            defaultValue={orderData ? orderData.fecha_pedido : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Total:
                        <input 
                            type="number" 
                            name="campo_total" 
                            defaultValue={orderData ? orderData.total_pagado : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Documento:
                        <input 
                            type="text" 
                            name="campo_documento" 
                            defaultValue={orderData ? orderData.documento : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Pago ID:
                        <input 
                            type="number" 
                            name="campo_pagoId" 
                            defaultValue={orderData ? orderData.pago_id : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Carrito ID:
                        <input 
                            type="number" 
                            name="campo_carritoId" 
                            defaultValue={orderData ? orderData.id_carrito : ''} 
                            required 
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        Nueva Foto:
                        <input 
                            type="file" 
                            name="campo_foto" 
                            accept="image/*" 
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {orderData ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageOrderModal;