import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Headerc from '../components/Header.c';
import Footer from '../components/Footer';

const App = () => {
    const [pedidos, setPedidos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemsPedido, setItemsPedido] = useState([]); // Nuevo estado para los items del pedido
    const [notification, setNotification] = useState('');

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            showNotification('Error al obtener pedidos: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchItemsByPedido = async (id_pedido) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/pedido/${id_pedido}/items`); // Cambia esta URL si es necesario
            setItemsPedido(response.data); // Actualizar el estado con los items
        } catch (error) {
            console.error('Error al obtener items del pedido:', error);
            showNotification('Error al obtener items del pedido: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleTogglePedidoStatus = async (idPedido, nuevoEstado) => {
        if (!idPedido) return;
        try {
            await axios.patch(`http://localhost:4000/api/pedidos/${idPedido}/estado`, { nuevo_estado: nuevoEstado });
            fetchPedidos();
            showNotification(`Estado del pedido ${idPedido} actualizado a "${nuevoEstado}".`);
        } catch (error) {
            console.error('Error al cambiar el estado del pedido:', error);
            showNotification('Error al cambiar el estado del pedido: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleOpenDetalle = async (pedido) => {
        setCurrentItem(pedido);
        setDetalleVisible(true);
        await fetchItemsByPedido(pedido.id_pedido); // Obtener items del pedido al abrir el detalle
    };

    const closeDetalle = () => {
        setDetalleVisible(false);
        setCurrentItem(null);
        setItemsPedido([]); // Limpiar items al cerrar el detalle
    };

    // Filtrado de pedidos
    const filteredPedidos = pedidos.filter(pedido =>
        pedido.fecha_pedido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.id_pedido.toString().includes(searchQuery)
    );

    return (
        <div className="admin-app">
            <Headerc />

            <div className="vend1-container">
                <div className="admin-header">
                    <h1 className="admin-title">¡Bienvenido Domiciliario!</h1>
                    <p className="admin-description">Utilice el menú de navegación para gestionar los pedidos.</p>
                </div>

                <div className="vend4-section">
                    <h2>Pedidos</h2>
                    <input
                        type="text"
                        placeholder="Buscar pedido..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-search"
                    />
                    <table className="vend4-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Nombre Cliente</th>
                                <th>Dirección</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPedidos.length > 0 ? (
                                filteredPedidos.map(pedido => (
                                    <tr key={pedido.id_pedido}>
                                        <td>{pedido.id_pedido}</td>
                                        <td>{pedido.fecha_pedido}</td>
                                        <td>{pedido.nombre_usuario} {pedido.apellido_usuario}</td>
                                        <td>{pedido.direccion}</td>
                                        <td>{pedido.total_pagado ? `${Math.floor(pedido.total_pagado)} USD` : 'N/A'}</td>
                                        <td>
                                            <select
                                                value={pedido.estado_pedido}
                                                onChange={(e) => handleTogglePedidoStatus(pedido.id_pedido, e.target.value)}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Enviado">Enviado</option>
                                                <option value="Entregado">Entregado</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </td>
                                        <td>
                                            <FontAwesomeIcon icon={faEye} onClick={() => handleOpenDetalle(pedido)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6">No hay pedidos disponibles</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Detalles del Pedido */}
                {detalleVisible && (
                    <div className="vend-detalle show" onClick={closeDetalle}>
                        <div className="detalle-content" onClick={e => e.stopPropagation()}>
                            <span className="close-btn" onClick={closeDetalle}>&times;</span>
                            <h2>Detalles del Pedido</h2>
                            {currentItem && (
                                <div>
                                    <p>ID: {currentItem.id_pedido}</p>
                                    <p>Fecha: {currentItem.fecha_pedido}</p>
                                    <p>Total: {currentItem.total_pagado}</p>
                                    <p>Estado: {currentItem.estado_pedido}</p>
                                    {currentItem.foto_PedidoURL && (
                                        <img
                                            src={currentItem.foto_PedidoURL}
                                            alt={`Pedido ${currentItem.id_pedido}`}
                                            className="product-img"
                                        />
                                    )}
                                    <h3>Items del Pedido:</h3>
                                    {itemsPedido.length > 0 ? (
                                        <ul>
                                            {itemsPedido.map(item => (
                                                <li key={item.id_pedido_item} style={{ width: '100px', marginRight: '50px' }}>
                                                    {item.foto_ProductoURL && (
                                                        <img src={item.foto_ProductoURL} alt={item.nombre_producto} style={{ width: '50px', marginRight: '10px' }} />
                                                    )}
                                                    <div>
                                                        <strong>{item.nombre_producto}</strong><br />
                                                        Cantidad: {item.cantidad}<br />
                                                        Precio Unitario: {item.precio_unitario} USD<br />
                                                        Opción Adicional: {item.opcion_adicional || 'Ninguna'}<br />
                                                        Dedicatoria: {item.dedicatoria || 'No especificada'}<br />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No hay items para este pedido.</p>
                                    )}

                                    <h3>Dirección de Envío:</h3>
                                    {itemsPedido.length > 0 ? (
                                        <p>{itemsPedido[0].direccion_envio || 'Dirección no especificada'}</p>
                                    ) : (
                                        <p>No hay dirección disponible.</p>
                                    )}


                                </div>
                            )}
                        </div>
                    </div>
                )}

                {notification && <div className="notification">{notification}</div>}
            </div>

            <Footer />
        </div>
    );
};

export default App;
