import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faToggleOn, faToggleOff, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Headerc from '../components/Header.c';
import Footer from '../components/Footer';
import ManageOptionModal from '../components/ManageOptionModal';

const App = () => {
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [opcionesAdicionales, setOpcionesAdicionales] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('productos');
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [notification, setNotification] = useState('');
    const [itemsPedido, setItemsPedido] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentOpcion, setCurrentOpcion] = useState(null);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    useEffect(() => {
        fetchProductos();
        fetchPedidos();
        fetchOpcionesAdicionales();
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setSearchQuery(''); // Reinicia la búsqueda al cambiar de sección
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            showNotification('Error al obtener productos: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            showNotification('Error al obtener pedidos: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchOpcionesAdicionales = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/opciones-adicionales');
            setOpcionesAdicionales(response.data);
        } catch (error) {
            console.error('Error al obtener opciones adicionales:', error);
            showNotification('Error al obtener opciones adicionales: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchItemsByPedido = async (id_pedido) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/pedido/${id_pedido}/items`);
            setItemsPedido(response.data);
        } catch (error) {
            console.error('Error al obtener items del pedido:', error);
            showNotification('Error al obtener items del pedido: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleOpenDetalle = async (pedido) => {
        setCurrentItem(pedido);
        setDetalleVisible(true);
        await fetchItemsByPedido(pedido.id_pedido);
    };

    const closeDetalle = () => {
        setDetalleVisible(false);
        setCurrentItem(null);
        setItemsPedido([]);
    };

    const handleToggleProductStatus = async (idProducto) => {
        if (!idProducto) return;
        try {
            const productoActual = productos.find(p => p.id_producto === idProducto);
            const nuevoEstado = !productoActual.estado_producto;

            await axios.patch(`http://localhost:4000/api/productos/${idProducto}/estado`, { estado: nuevoEstado });
            fetchProductos();
            showNotification(`Estado del producto ${idProducto} actualizado a "${nuevoEstado ? 'Activo' : 'Inactivo'}".`);
        } catch (error) {
            console.error('Error al cambiar el estado del producto:', error);
            showNotification('Error al cambiar el estado del producto: ' + (error.response ? error.response.data.message : error.message));
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

    // Filtrado de productos
    const filteredProductos = productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.id_producto.toString().includes(searchQuery) ||
        producto.codigo_producto.toString().includes(searchQuery)
    );

    // Filtrado de pedidos
    const filteredPedidos = pedidos.filter(pedido =>
        pedido.fecha_pedido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.id_pedido.toString().includes(searchQuery)
    );

    const createOpcionAdicional = async (nuevaOpcion) => {
        try {
            await axios.post('http://localhost:4000/api/opciones-adicionales', nuevaOpcion);
            fetchOpcionesAdicionales();
            closeModal();
            showNotification('Opción adicional creada exitosamente.');
        } catch (error) {
            console.error('Error al crear opción adicional:', error);
        }
    };

    const updateOpcionAdicional = async (id_opcion, nuevaOpcion) => {
        try {
            const { opcion_adicional, precio_adicional } = nuevaOpcion; // Desestructura las propiedades
            await axios.put(`http://localhost:4000/api/opciones-adicionales/${id_opcion}`, {
                nueva_opcion_adicional: opcion_adicional, // Renombra la propiedad
                nuevo_precio_adicional: precio_adicional // Renombra la propiedad
            });
            fetchOpcionesAdicionales();
            closeModal();
            showNotification('Opción adicional actualizada exitosamente.');
        } catch (error) {
            console.error('Error al actualizar opción adicional:', error);
        }
    };

    const deleteOpcionAdicional = async (id_opcion) => {
        try {
            await axios.delete(`http://localhost:4000/api/opciones-adicionales/${id_opcion}`);
            fetchOpcionesAdicionales();
            showNotification('Opción adicional eliminada exitosamente.');
        } catch (error) {
            console.error('Error al eliminar opción adicional:', error);
        }
    };

    const handleOpenModal = (opcion = null) => {
        setCurrentOpcion(opcion);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentOpcion(null);
    };

    const handleSaveOption = (data) => {
        if (currentOpcion) {
            updateOpcionAdicional(currentOpcion.id_opcion, data);
        } else {
            createOpcionAdicional(data);
        }
    };

    return (
        <div className="admin-app">
            <Headerc />
            <div className="vend1-container">
                <div className="admin-header">
                    <h1 className="admin-title">¡Bienvenido Vendedor!</h1>
                    <p className="admin-description">Utilice el menú de navegación para gestionar los productos y pedidos.</p>
                </div>
                <div className="admin-nav">
                    <button className="admin-nav-button" onClick={() => handleSectionChange('productos')}>Productos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('pedidos')}>Pedidos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('opciones')}>Opciones Adicionales</button>
                </div>

                {activeSection === 'productos' && (
                    <div className="vend5-product-section">
                        <h2>Productos</h2>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="admin-search"
                        />
                        <table className="vend5-product-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Foto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProductos.length > 0 ? (
                                    filteredProductos.map(producto => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.id_producto}</td>
                                            <td>{producto.codigo_producto}</td>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.cantidad_disponible}</td>
                                            <td>{producto.precio_producto ? `${Math.floor(producto.precio_producto)} USD` : 'N/A'}</td>
                                            <td>{producto.estado_producto ? 'Activo' : 'Inactivo'}</td>
                                            <td>
                                                {producto.foto_ProductoURL ? (
                                                    <img
                                                        src={producto.foto_ProductoURL}
                                                        alt={producto.nombre_producto}
                                                        style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <span>No disponible</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={producto.estado_producto ? faToggleOn : faToggleOff}
                                                        onClick={() => handleToggleProductStatus(producto.id_producto)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8">No hay productos disponibles</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'pedidos' && (
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
                                    <th>Documento Cliente</th>
                                    <th>Nombre Cliente</th>
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
                                            <td>{pedido.documento}</td>
                                            <td>{pedido.nombre_usuario} {pedido.apellido_usuario}</td>
                                            <td>{pedido.total_pagado}</td>
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
                                    <tr><td colSpan="7">No hay pedidos disponibles</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'opciones' && (
                    <div className="vend4-section">
                        <h2>Opciones Adicionales</h2>
                        <input
                            type="text"
                            placeholder="Buscar opción adicional..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="admin-search"
                        />
                        <button onClick={() => handleOpenModal()} className="admin-add-button">Agregar Opción</button>
                        <table className="vend4-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Opción Adicional</th>
                                    <th>Precio Adicional</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opcionesAdicionales.filter(opcion =>
                                    opcion.opcion_adicional.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    opcion.id_opcion.toString().includes(searchQuery)
                                ).map(opcion => (
                                    <tr key={opcion.id_opcion}>
                                        <td>{opcion.id_opcion}</td>
                                        <td>{opcion.opcion_adicional}</td>
                                        <td>{opcion.precio_adicional}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="icon-edit"
                                                    title="Editar tipo de flor"
                                                    onClick={() => handleOpenModal(opcion)}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="icon-delete"
                                                    title="Eliminar tipo de flor"
                                                    onClick={() => deleteOpcionAdicional(opcion.id_opcion)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {modalVisible && (
                    <ManageOptionModal
                        onClose={closeModal}
                        onSave={handleSaveOption}
                        optionData={currentOpcion}
                    />
                )}

                {detalleVisible && (
                    <div className="vend-detalle show" onClick={closeDetalle}>
                        <div className="detalle-content" onClick={e => e.stopPropagation()}>
                            <span className="close-btn" onClick={closeDetalle}>&times;</span>
                            <h2>Detalles del Pedido</h2>
                            {currentItem && (
                                <div>
                                    <p>ID: {currentItem.id_pedido}</p>
                                    <p>Fecha: {currentItem.fecha_pedido}</p>
                                    <p>Total: {currentItem.total_pagado} USD</p>
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
                                                <li key={item.id_pedido_item} style={{ marginBottom: '10px' }}>
                                                    {item.foto_ProductoURL && (
                                                        <img src={item.foto_ProductoURL} alt={item.nombre_producto} style={{ width: '100px', marginRight: '50px' }} />
                                                    )}
                                                    <div>
                                                        <strong>{item.nombre_producto}</strong><br />
                                                        Cantidad: {item.cantidad}<br />
                                                        Precio Unitario: {item.precio_unitario} <br />
                                                        {item.opcion_adicional && (
                                                            <><strong>Opción Adicional:</strong> {item.opcion_adicional}<br /></>
                                                        )}
                                                        {item.precio_adicional ? (
                                                            <>
                                                                <strong>Precio Adicional:</strong> {item.precio_adicional} <br />
                                                            </>
                                                        ) : null}
                                                        {item.dedicatoria && (
                                                            <>
                                                                <strong>Dedicatoria:</strong> {item.dedicatoria}<br />
                                                            </>
                                                        )}
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
