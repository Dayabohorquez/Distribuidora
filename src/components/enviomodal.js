import React, { useState, useEffect } from 'react';
import '../index.css';

const EnvioModal = ({ currentEnvio, isOpen, onClose, onSave }) => {
    const [fechaEnvio, setFechaEnvio] = useState('');
    const [pedidoId, setPedidoId] = useState('');

    useEffect(() => {
        if (currentEnvio) {
            // Convertir fecha a formato adecuado para el input de tipo "date"
            const date = new Date(currentEnvio.fecha_envio);
            setFechaEnvio(date.toISOString().split('T')[0]); // YYYY-MM-DD
            setPedidoId(currentEnvio.pedido_id);
        } else {
            setFechaEnvio('');
            setPedidoId('');
        }
    }, [currentEnvio]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const envioData = { 
            fecha_envio: fechaEnvio,
            pedido_id: pedidoId
        };
    
        console.log('Datos a enviar:', envioData);
        onSave(envioData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">{currentEnvio ? 'Editar Envío' : 'Crear Envío'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Fecha de Envío:
                        <input
                            type="date"
                            value={fechaEnvio}
                            onChange={(e) => setFechaEnvio(e.target.value)}
                            required
                            className="admin-form-input"
                        />
                    </label>
                    <label className="admin-form-label">
                        ID Pedido:
                        <input
                            type="number"
                            value={pedidoId}
                            onChange={(e) => setPedidoId(e.target.value)}
                            required
                            className="admin-form-input"
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="admin-modal-button">
                            {currentEnvio ? 'Actualizar' : 'Crear'}
                        </button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnvioModal;
