import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Headerc from "../components/Header.c";
import Footer from "../components/Footer";

const App = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Obtener pedidos desde la API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/pedidos/');
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error('La respuesta no es un arreglo:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };

        fetchOrders();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.estado_pedido); // Inicializa el nuevo estado con el estado actual del pedido
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const updateStatus = async () => {
        if (selectedOrder) {
            if (window.confirm(`¿Estás seguro de que deseas actualizar el estado del pedido ${selectedOrder.id_pedido} a: ${newStatus}?`)) {
                try {
                    await axios.patch(`http://localhost:4000/api/pedidos/${selectedOrder.id_pedido}/estado`, { nuevo_estado: newStatus });
                    const updatedOrders = orders.map((order) =>
                        order.id_pedido === selectedOrder.id_pedido ? { ...order, estado_pedido: newStatus } : order
                    );
                    setOrders(updatedOrders);
                    setSelectedOrder({ ...selectedOrder, estado_pedido: newStatus });
                    closeModal(); // Cierra el modal después de la actualización
                } catch (error) {
                    console.error('Error al actualizar el estado del pedido:', error);
                }
            }
        }
    };

    return (
        <div className="app-container">
            <Headerc />
            <div className="domiciliario-container">
                <div className="domiciliario-greeting">
                    <h1>¡Bienvenido Domiciliario!</h1>
                </div>
                <div className="domiciliario-orders-section">
                    <h2>Pedidos Asignados</h2>
                    <table className="domiciliario-orders-table">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id_pedido}>
                                    <td>{order.id_pedido}</td>
                                    <td>{order.fecha_pedido}</td>
                                    <td>{order.documento}</td>
                                    <td>{order.estado_pedido}</td>
                                    <td>
                                        <img src={order.foto_PedidoURL || 'https://via.placeholder.com/100'} alt="Imagen del Pedido" className="order-image" />
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => openModal(order)}>Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedOrder && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                            <h2>Detalles del Pedido</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID Pedido</th>
                                        <td>{selectedOrder.id_pedido}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha</th>
                                        <td>{selectedOrder.fecha_pedido}</td>
                                    </tr>
                                    <tr>
                                        <th>Cliente</th>
                                        <td>{selectedOrder.documento}</td>
                                    </tr>
                                    <tr>
                                        <th>Teléfono</th>
                                        <td>{selectedOrder.telefono}</td>
                                    </tr>
                                    <tr>
                                        <th>Dirección</th>
                                        <td>{selectedOrder.direccion}</td>
                                    </tr>
                                    <tr>
                                        <th>Productos</th>
                                        <td>{selectedOrder.productos}</td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td>{selectedOrder.total_pagado}</td>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <td><img src="http://localhost:4000/uploads/pedido_1.jpg" alt="Imagen del Pedido" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="order-actions">
                                <label htmlFor="order-status">Cambiar Estado:</label>
                                <select
                                    id="order-status"
                                    value={newStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                                <button className="update-status-btn" onClick={updateStatus}>
                                    Actualizar Estado
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
