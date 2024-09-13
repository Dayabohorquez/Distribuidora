import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const App = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // Obtener pedidos y productos desde la API
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

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/productos/');
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.error('La respuesta no es un arreglo:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchOrders();
        fetchProducts();
    }, []);

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.estado_pedido); // Inicializa el nuevo estado con el estado actual del pedido
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setSelectedProduct(null);
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const updateOrderStatus = async () => {
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

    const toggleProductStatus = async (productId) => {
        try {
            const product = products.find(p => p.id_producto === productId);
            const newStatus = product.estado_producto === 'Activo' ? 'Inactivo' : 'Activo';
            await axios.patch(`http://localhost:4000/api/productos/${productId}`, { estado_producto: newStatus });
            const updatedProducts = products.map(p =>
                p.id_producto === productId ? { ...p, estado_producto: newStatus } : p
            );
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error al actualizar el estado del producto:', error);
        }
    };

    return (
        <div className="app-container">
            <Header />
            <div className="vend1-container">
                <div className="vend2-greeting">
                    <h1>¡Bienvenido Vendedor!</h1>
                </div>

                <div className="button-vendedor">
                    <button onClick={() => document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth' })}>Ver Pedidos</button>
                    <button onClick={() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })}>Ver Productos</button>
                </div>

                <div id="pedidos" className="vend4-section">
                    <h2>Pedidos Recientes</h2>
                    <table className="vend4-table">
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
                            {orders.map(order => (
                                <tr key={order.id_pedido}>
                                    <td>{order.id_pedido}</td>
                                    <td>{order.fecha_pedido}</td>
                                    <td>{order.documento}</td>
                                    <td>{order.estado_pedido}</td>
                                    <td>
                                        <img src={order.foto_PedidoURL || 'https://via.placeholder.com/100'} alt="Imagen del Pedido" className="order-image" />
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => openOrderModal(order)}>Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div id="productos" className="vend5-product-section">
                    <h2>Productos Disponibles</h2>
                    <table className="vend5-product-table">
                        <thead>
                            <tr>
                                <th>ID Producto</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Imagen</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id_producto}>
                                    <td>{product.id_producto}</td>
                                    <td>{product.nombre_producto}</td>
                                    <td>{product.descripcion_producto}</td>
                                    <td>{product.precio_producto}</td>
                                    <td>{product.estado_producto}</td>
                                    <td>
                                        <img src={product.foto_ProductoURL || 'https://via.placeholder.com/100'} alt="Imagen del Producto" className="product-image" />
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => openProductModal(product)}>Ver</button>
                                        <button className="update-status-btn" onClick={() => toggleProductStatus(product.id_producto)}>Actualizar Estado</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal de Detalles del Pedido */}
                {selectedOrder && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                                        <td>
                                            <img src={selectedOrder.foto_PedidoURL || 'https://via.placeholder.com/100'} alt="Imagen del Pedido" />
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
                                    <option value="Completo">Completo</option> {/* Estado Completo agregado */}
                                </select>
                                <button className="update-status-btn" onClick={updateOrderStatus}>
                                    Actualizar Estado
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Detalles del Producto */}
                {selectedProduct && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                            <h2>Detalles del Producto</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID Producto</th>
                                        <td>{selectedProduct.id_producto}</td>
                                    </tr>
                                    <tr>
                                        <th>Nombre</th>
                                        <td>{selectedProduct.nombre_producto}</td>
                                    </tr>
                                    <tr>
                                        <th>Descripción</th>
                                        <td>{selectedProduct.descripcion_producto}</td>
                                    </tr>
                                    <tr>
                                        <th>Precio</th>
                                        <td>{selectedProduct.precio_producto}</td>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <td>
                                            <img src={selectedProduct.foto_ProductoURL || 'https://via.placeholder.com/100'} alt="Imagen del Producto" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
