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
                            defaultValue={orderData ? orderData.fecha_pedido.split('T')[0] : ''} // Formato de fecha
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
                            min="0" // Total no negativo
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
                            min="1" // ID de pago positivo
                            className="admin-form-input"
                        />
                    </label>
                    {/* Mostrar Carrito ID solo al crear un pedido */}
                    {!orderData && (
                        <label className="admin-form-label">
                            Carrito ID:
                            <input 
                                type="number" 
                                name="campo_carritoId" 
                                required 
                                min="1" // ID de carrito positivo
                                className="admin-form-input"
                            />
                        </label>
                    )}
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
