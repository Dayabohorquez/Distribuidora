import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Headerc from '../components/Header.c';

const App = () => {
    const [pedidos, setPedidos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [itemsPedido, setItemsPedido] = useState([]);
    const [notification, setNotification] = useState('');
    const [sortColumn, setSortColumn] = useState('documento');
    const [sortDirection, setSortDirection] = useState('asc');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState('pedidos');
    
    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            showNotification('Error al obtener pedidos: ' + error.message);
        }
    };

    const fetchItemsByPedido = async (id_pedido) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/pedido/${id_pedido}/items`);
            setItemsPedido(response.data);
        } catch (error) {
            showNotification('Error al obtener items del pedido: ' + error.message);
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleTogglePedidoStatus = async (idPedido, nuevoEstado) => {
        try {
            await axios.patch(`http://localhost:4000/api/pedidos/${idPedido}/estado`, { nuevo_estado: nuevoEstado });
            fetchPedidos();
            showNotification(`Estado del pedido ${idPedido} actualizado a "${nuevoEstado}".`);
        } catch (error) {
            showNotification('Error al cambiar el estado del pedido: ' + error.message);
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

    // Filtro para pedidos
    const filteredAndSortedPedidos = pedidos.filter((pedido) => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        return (
            pedido.id_pedido.toString().includes(lowerCaseQuery) ||
            (typeof pedido.fecha_pedido === 'string' && pedido.fecha_pedido.toLowerCase().includes(lowerCaseQuery)) ||
            (typeof pedido.documento === 'string' && pedido.documento.toLowerCase().includes(lowerCaseQuery)) ||
            (`${pedido.nombre_usuario} ${pedido.apellido_usuario}`.toLowerCase().includes(lowerCaseQuery)) ||
            pedido.total_pagado.toString().includes(lowerCaseQuery) ||
            (typeof pedido.estado_pedido === 'string' && pedido.estado_pedido.toLowerCase().includes(lowerCaseQuery))
        );
    });

    const columnMapPedidos = {
        'ID': 'id_pedido',
        'Fecha': 'fecha_pedido',
        'Nombre Cliente': 'nombre_usuario',
        'Dirección': 'direccion',
        'Total': 'total_pagado',
        'Estado': 'estado_pedido'
    };

    // Ordenar Pedidos
    const sortedPedidos = [...filteredAndSortedPedidos].sort((a, b) => {
        const aValue = a[columnMapPedidos[sortColumn]];
        const bValue = b[columnMapPedidos[sortColumn]];
    
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
    
        const aIsDate = aValue instanceof Date;
        const bIsDate = bValue instanceof Date;
    
        if (aIsDate && bIsDate) {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
    });

    // Paginación
    const totalPagesPedidos = Math.ceil(sortedPedidos.length / rowsPerPage);
    const startIndexPedidos = (currentPage - 1) * rowsPerPage;
    const endIndexPedidos = startIndexPedidos + rowsPerPage;
    const paginatedPedidos = sortedPedidos.slice(startIndexPedidos, endIndexPedidos);

    const handleSearchChangePedidos = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortPedidos = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    return (
        <div className="admin-app">
            <Headerc />
            <div className="vend1-container">
                <div className="admin-header">
                    <h1 className="admin-title">¡Bienvenido Domiciliario!</h1>
                    <p className="admin-description">Utilice el menú de navegación para gestionar los pedidos.</p>
                </div>

                {activeSection === 'pedidos' && (
                    <div className="vend4-section">
                        <div className="admin-section-header">
                        <h2>Pedidos</h2>
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            value={searchQuery}
                            onChange={handleSearchChangePedidos}
                            className="admin-search"
                        />
                        <div className="admi">
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                </div>
            </div>
                        <table className="vend4-table">
                            <thead>
                            <tr>
                    {['ID', 'Fecha', 'Nombre Cliente', 'Dirección', 'Total', 'Estado'].map((col) => (
                        <th key={col} onClick={() => handleSortPedidos(col)} style={{ cursor: 'pointer' }}>
                            {col.charAt(0).toUpperCase() + col.slice(1)}
                            {sortColumn === col && (
                                <span className={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}></span>
                            )}
                        </th>
                    ))}
                    <th>Acciones</th>
                </tr>
                            </thead>
                            <tbody>
                                {paginatedPedidos.map(pedido => (
                                    <tr key={pedido.id_pedido}>
                                        <td>{pedido.id_pedido}</td>
                                        <td>{pedido.fecha_pedido}</td>
                                        <td>{pedido.nombre_usuario} {pedido.apellido_usuario}</td>
                                        <td>{pedido.direccion}</td>
                                        <td>${parseFloat(pedido.total_pagado).toLocaleString()}</td>
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
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>Página {currentPage} de {totalPagesPedidos}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesPedidos))} disabled={currentPage === totalPagesPedidos}>
                Siguiente
            </button>
        </div>
                    </div>
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
                                        <img src={currentItem.foto_PedidoURL} alt={`Pedido ${currentItem.id_pedido}`} className="product-img" />
                                    )}
                                    <h3>Items del Pedido:</h3>
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
                                                    {item.opcion_adicional && <><strong>Opción Adicional:</strong> {item.opcion_adicional}<br /></>}
                                                    {item.precio_adicional && <><strong>Precio Adicional:</strong> {item.precio_adicional} <br /></>}
                                                    {item.dedicatoria && <><strong>Dedicatoria:</strong> {item.dedicatoria}<br /></>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
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
