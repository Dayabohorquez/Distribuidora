import React, { useState } from 'react';
import '../index.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const App = () => {
    const [orders, setOrders] = useState([
        {
            id: '001',
            date: '2024-09-05',
            client: 'Juan Pérez',
            status: 'En camino',
            image: 'https://via.placeholder.com/100',
            phone: '123456789',
            address: 'Calle Ejemplo 123',
            products: 'Rosa Roja, Tulipanes',
            total: '$25',
        },
        // Puedes agregar más pedidos aquí
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const openModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const updateStatus = () => {
        if (selectedOrder) {
            if (window.confirm(`¿Estás seguro de que deseas actualizar el estado del pedido ${selectedOrder.id} a: ${newStatus}?`)) {
                const updatedOrders = orders.map((order) =>
                    order.id === selectedOrder.id ? { ...order, status: newStatus } : order
                );
                setOrders(updatedOrders);
                setSelectedOrder({ ...selectedOrder, status: newStatus });
                closeModal();  // Cierra el modal después de la actualización
            }
        }
    };

    return (
        <div className="app-container">
            <Header />
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
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.client}</td>
                                    <td>{order.status}</td>
                                    <td><img src={order.image} alt="Imagen del Pedido" className="order-image" /></td>
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
                                        <td>{selectedOrder.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha</th>
                                        <td>{selectedOrder.date}</td>
                                    </tr>
                                    <tr>
                                        <th>Cliente</th>
                                        <td>{selectedOrder.client}</td>
                                    </tr>
                                    <tr>
                                        <th>Teléfono</th>
                                        <td>{selectedOrder.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Dirección</th>
                                        <td>{selectedOrder.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Productos</th>
                                        <td>{selectedOrder.products}</td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td>{selectedOrder.total}</td>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <td><img src={selectedOrder.image} alt="Imagen del Pedido" className="order-image" /></td>
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
                                    <option value="En camino">En camino</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Retrasado">Retrasado</option>
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
