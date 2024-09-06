import React, { useState } from 'react';
import '../index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import rosaRojaImg from '../static/img/ramoBase2.jpeg';
import tulipanesImg from '../static/img/Ramillete1.jpeg';

// Puedes importar las imágenes aquí si las usas directamente
const orderImage1 = rosaRojaImg;  // Puedes asignar las imágenes importadas
const orderImage2 = tulipanesImg;  // Usar rutas relativas

const App = () => {
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [productModalVisible, setProductModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Definición del estado para pedidos y productos
    const [orders, setOrders] = useState([
        { id: '123', date: '2024-09-01', customer: 'Juan Pérez', status: 'Pendiente', image: orderImage1 },
        { id: '124', date: '2024-09-02', customer: 'María Gómez', status: 'Pendiente', image: orderImage2 }
    ]);

    const [products, setProducts] = useState([
        { id: '001', name: 'Rosa Roja', description: 'Rosa roja fresca de 12 pulgadas', price: '$10', status: 'Activo', image: rosaRojaImg },
        { id: '002', name: 'Tulipanes', description: 'Tulipanes coloridos en varios tonos', price: '$15', status: 'Activo', image: tulipanesImg }
    ]);

    const viewOrder = (order) => {
        setCurrentOrder(order);
        setOrderModalVisible(true);
    };

    const viewProduct = (product) => {
        setCurrentProduct(product);
        setProductModalVisible(true);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const toggleProductStatus = (productId) => {
        setProducts(products.map(product =>
            product.id === productId ? { ...product, status: product.status === 'Activo' ? 'Inactivo' : 'Activo' } : product
        ));
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
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.status}</td>
                                    <td><img src={order.image} alt="Imagen del Pedido" className="product-img" /></td>
                                    <td>
                                        <button className="action-btn" onClick={() => viewOrder(order)}><FontAwesomeIcon icon={faEye} /> Ver</button>
                                        <button className="action-btn" onClick={() => updateOrderStatus(order.id, 'Completado')}><FontAwesomeIcon icon={faCheck} /> Completar</button>
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
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.status}</td>
                                    <td><img src={product.image} alt={product.name} className="product-img" /></td>
                                    <td>
                                        <button className="action-btn" onClick={() => viewProduct(product)}><FontAwesomeIcon icon={faEye} /> Ver</button>
                                        <button className="update-status-btn" onClick={() => toggleProductStatus(product.id)}>Actualizar Estado</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal de Detalles del Pedido */}
                {orderModalVisible && currentOrder && (
                    <div className="modal show" onClick={() => setOrderModalVisible(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <span className="close-btn" onClick={() => setOrderModalVisible(false)}>&times;</span>
                            <h2>Detalles del Pedido</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID Pedido</th>
                                        <td>{currentOrder.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha</th>
                                        <td>{currentOrder.date}</td>
                                    </tr>
                                    <tr>
                                        <th>Cliente</th>
                                        <td>{currentOrder.customer}</td>
                                    </tr>
                                    <tr>
                                        <th>Productos</th>
                                        <td>Rosa Roja, Tulipanes</td>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <td>$25</td>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <td><img src={currentOrder.image} alt="Imagen del Pedido" className="product-img" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal de Detalles del Producto */}
                {productModalVisible && currentProduct && (
                    <div className="modal show" onClick={() => setProductModalVisible(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <span className="close-btn" onClick={() => setProductModalVisible(false)}>&times;</span>
                            <h2>Detalles del Producto</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID Producto</th>
                                        <td>{currentProduct.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Nombre</th>
                                        <td>{currentProduct.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Descripción</th>
                                        <td>{currentProduct.description}</td>
                                    </tr>
                                    <tr>
                                        <th>Precio</th>
                                        <td>{currentProduct.price}</td>
                                    </tr>
                                    <tr>
                                        <th>Imagen</th>
                                        <td><img src={currentProduct.image} alt={currentProduct.name} className="product-img" /></td>
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