import React from 'react';
import '../index.css';

const EditProdModal = ({ producto, onClose, onSave }) => {
    if (!producto) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(event);
    };

    return (
        <div className="admin-modal">
            <div className="admin-modal-content">
                <span className="admin-modal-close" onClick={onClose}>&times;</span>
                <h2 className="admin-modal-header">Editar Producto</h2>
                <form onSubmit={handleSubmit}>
                    <label className="admin-form-label">
                        Código:
                        <input 
                            type="text" 
                            name="campo_codigo" 
                            className="admin-form-input" 
                            defaultValue={producto.codigo_producto} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Nombre:
                        <input 
                            type="text" 
                            name="campo_nombre" 
                            className="admin-form-input" 
                            defaultValue={producto.nombre_producto} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Descripción:
                        <input 
                            type="text" 
                            name="campo_descripcion" 
                            className="admin-form-input" 
                            defaultValue={producto.descripcion_producto} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Precio:
                        <input 
                            type="number" 
                            name="campo_precio" 
                            className="admin-form-input" 
                            defaultValue={producto.precio_producto} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Cantidad Disponible:
                        <input 
                            type="number" 
                            name="campo_cantidad" 
                            className="admin-form-input" 
                            defaultValue={producto.cantidad_disponible} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Tipo de Flor:
                        <input 
                            type="number" 
                            name="campo_idTipoFlor" 
                            className="admin-form-input" 
                            defaultValue={producto.id_tipo_flor} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Evento:
                        <input 
                            type="number" 
                            name="campo_idEvento" 
                            className="admin-form-input" 
                            defaultValue={producto.id_evento} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Fecha Especial:
                        <input 
                            type="number" 
                            name="campo_idFechaEspecial" 
                            className="admin-form-input" 
                            defaultValue={producto.id_fecha_especial} 
                            required 
                        />
                    </label>
                    <label className="admin-form-label">
                        Foto Actual:
                        <img 
                            src={producto.foto_ProductoURL} 
                            alt={producto.nombre_producto} 
                            className="product-image" 
                            style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '10px' }} 
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
                        <button type="submit" className="admin-modal-button">Guardar</button>
                        <button type="button" className="admin-modal-button" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );    
};

export default EditProdModal;
