import { faEdit, faEye, faToggleOff, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Headerc from '../components/Header.c';
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
    const [sortColumn, setSortColumn] = useState('documento');
    const [sortDirection, setSortDirection] = useState('asc');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

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
            showNotification('Error al obtener productos: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            showNotification('Error al obtener pedidos: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchOpcionesAdicionales = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/opciones-adicionales');
            setOpcionesAdicionales(response.data);
        } catch (error) {
            showNotification('Error al obtener opciones adicionales: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const fetchItemsByPedido = async (id_pedido) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/pedido/${id_pedido}/items`);
            setItemsPedido(response.data);
        } catch (error) {
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
        }
    };

    const deleteOpcionAdicional = async (id_opcion) => {
        try {
            await axios.delete(`http://localhost:4000/api/opciones-adicionales/${id_opcion}`);
            fetchOpcionesAdicionales();
            showNotification('Opción adicional eliminada exitosamente.');
        } catch (error) {
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

    // Filtro para productos
const filteredAndSortedProductos = productos.filter((producto) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    return (
        producto.id_producto.toString().includes(lowerCaseQuery) ||
        (typeof producto.codigo_producto === 'string' && producto.codigo_producto.toLowerCase().includes(lowerCaseQuery)) ||
        (typeof producto.nombre_producto === 'string' && producto.nombre_producto.toLowerCase().includes(lowerCaseQuery)) ||
        producto.cantidad_disponible.toString().includes(lowerCaseQuery) ||
        (producto.precio_producto?.toString() || '').includes(lowerCaseQuery) ||
        (producto.estado_producto ? 'activo' : 'inactivo').includes(lowerCaseQuery)
    );
});

    const columnMapProductos = {
        'id': 'id_producto',
        'codigo': 'codigo_producto',
        'nombre': 'nombre_producto',
        'cantidad': 'cantidad_disponible',
        'precio': 'precio_producto',
        'estado': 'estado_producto'
    };

    // Ordenar Productos
    const sortedProductos = [...filteredAndSortedProductos].sort((a, b) => {
        const aValue = a[columnMapProductos[sortColumn]];
        const bValue = b[columnMapProductos[sortColumn]];
    
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
    const totalPagesProductos = Math.ceil(sortedProductos.length / rowsPerPage);
    const startIndexProductos = (currentPage - 1) * rowsPerPage;
    const endIndexProductos = startIndexProductos + rowsPerPage;
    const paginatedProductos = sortedProductos.slice(startIndexProductos, endIndexProductos);

    const handleSearchChangeProductos = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortProductos = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
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
        'Documento Cliente': 'documento',
        'Nombre Cliente': 'nombre_usuario',
        'Total': 'total_pagado',
        'Estado': 'estado_pedido'
    };

    // Ordenar Productos
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

    // Filtro para opciones adicionales
    const filteredAndSortedOpciones = opcionesAdicionales.filter((opcion) => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        return (
            opcion.id_opcion.toString().includes(lowerCaseQuery) ||
            opcion.opcion_adicional.toLowerCase().includes(lowerCaseQuery) ||
            opcion.precio_adicional.toString().includes(lowerCaseQuery)
        );
    });

    const columnMapOpciones = {
        'ID': 'id_opcion',
        'Opción Adicional': 'opcion_adicional',
        'Precio Adicional': 'precio_adicional'
    };

    // Ordenar Opciones
    const sortedOpciones = [...filteredAndSortedOpciones].sort((a, b) => {
        const aValue = a[columnMapOpciones[sortColumn]];
        const bValue = b[columnMapOpciones[sortColumn]];
    
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
    const totalPagesOpciones = Math.ceil(sortedOpciones.length / rowsPerPage);
    const startIndexOpciones = (currentPage - 1) * rowsPerPage;
    const endIndexOpciones = startIndexOpciones + rowsPerPage;
    const paginatedOpciones = sortedOpciones.slice(startIndexOpciones, endIndexOpciones);

    const handleSearchChangeOpciones = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortOpciones = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
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
    <div className="admin-section">
        <div className="admin-section-header">
            <h2>Productos</h2>
            <input
                type="text"
                id="search-productos"
                className="admin-search"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={handleSearchChangeProductos}
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
        <table className="admin-table">
            <thead>
            <tr>
                    {['id', 'codigo', 'nombre', 'cantidad', 'precio', 'estado', 'foto'].map((col) => (
                        <th key={col} onClick={() => handleSortProductos(col)} style={{ cursor: 'pointer' }}>
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
                {paginatedProductos.length > 0 ? (
                    paginatedProductos.map(producto => (
                        <tr key={producto.id_producto}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.codigo_producto}</td>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.cantidad_disponible}</td>
                            <td>${parseFloat(producto.precio_producto).toLocaleString()}</td>
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
                    <tr><td colSpan="8" className="no-events-message">No hay productos disponibles</td></tr>
                )}
            </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>Página {currentPage} de {totalPagesProductos}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesProductos))} disabled={currentPage === totalPagesProductos}>
                Siguiente
            </button>
        </div>
    </div>
)}

{activeSection === 'pedidos' && (
    <div className="admin-section">
        <div className="admin-section-header">
            <h2>Pedidos</h2>
            <input
                type="text"
                id="search-pedidos"
                className="admin-search"
                placeholder="Buscar pedido..."
                value={searchQuery}
                onChange={handleSearchChangePedidos}
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
        <table className="admin-table">
            <thead>
            <tr>
                    {['ID', 'Fecha', 'Documento Cliente', 'Nombre Cliente', 'Total', 'Estado'].map((col) => (
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
                {paginatedPedidos.length > 0 ? (
                    paginatedPedidos.map(pedido => (
                        <tr key={pedido.id_pedido}>
                            <td>{pedido.id_pedido}</td>
                            <td>{pedido.fecha_pedido}</td>
                            <td>{pedido.documento}</td>
                            <td>{pedido.nombre_usuario} {pedido.apellido_usuario}</td>
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
                    ))
                ) : (
                    <tr><td colSpan="7" className="no-events-message">No hay pedidos disponibles</td></tr>
                )}
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

{activeSection === 'opciones' && (
    <div className="admin-section">
        <div className="admin-section-header">
            <h2>Opciones <br></br>Adicionales</h2>
            <input
                type="text"
                id="search-opciones"
                className="admin-search"
                placeholder="Buscar opción adicional..."
                value={searchQuery}
                onChange={handleSearchChangeOpciones}
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
        <div className="button-container">
        <button onClick={() => handleOpenModal()} className="admin-add-button">Agregar Opción</button>
        </div>
        <table className="admin-table">
            <thead>
            <tr>
                    {['ID', 'Opción Adicional', 'Precio Adicional'].map((col) => (
                        <th key={col} onClick={() => handleSortOpciones(col)} style={{ cursor: 'pointer' }}>
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
                {paginatedOpciones.filter(opcion =>
                    opcion.opcion_adicional.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    opcion.id_opcion.toString().includes(searchQuery)
                ).map(opcion => (
                    <tr key={opcion.id_opcion}>
                        <td>{opcion.id_opcion}</td>
                        <td>{opcion.opcion_adicional}</td>
                        <td>${parseFloat(opcion.precio_adicional).toLocaleString()}</td>
                        <td>
                            <div className="admin-actions">
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="icon-edit"
                                    title="Editar opción"
                                    onClick={() => handleOpenModal(opcion)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="icon-delete"
                                    title="Eliminar opción"
                                    onClick={() => deleteOpcionAdicional(opcion.id_opcion)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>Página {currentPage} de {totalPagesOpciones}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesOpciones))} disabled={currentPage === totalPagesOpciones}>
                Siguiente
            </button>
        </div>
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
