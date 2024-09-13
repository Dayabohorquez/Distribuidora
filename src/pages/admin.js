import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { faEdit, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const App = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [envios, setEnvios] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);

    useEffect(() => {
        if (activeSection === 'usuarios') fetchUsuarios();
        if (activeSection === 'productos') fetchProductos();
        if (activeSection === 'pedidos') fetchPedidos();
        if (activeSection === 'envios') fetchEnvios();
    }, [activeSection]);

    // Fetch functions
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    const fetchEnvios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/envios');
            setEnvios(response.data);
        } catch (error) {
            console.error('Error al obtener los envíos:', error);
        }
    };

    // Update functions
    const handleUpdateUsuario = async (id, updatedUsuario) => {
        try {
            await axios.put(`http://localhost:4000/api/usuarios/${id}`, updatedUsuario);
            fetchUsuarios();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    const handleUpdateProducto = async (id, updatedProducto) => {
        try {
            await axios.put(`http://localhost:4000/api/productos/${id}`, updatedProducto);
            fetchProductos();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const handleUpdatePedido = async (id, updatedPedido) => {
        try {
            await axios.put(`http://localhost:4000/api/pedidos/${id}`, updatedPedido);
            fetchPedidos();
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
        }
    };

    const handleUpdateEnvio = async (id, updatedEnvio) => {
        try {
            await axios.put(`http://localhost:4000/api/envios/${id}`, updatedEnvio);
            fetchEnvios();
        } catch (error) {
            console.error('Error al actualizar el envío:', error);
        }
    };

    // Event handlers
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const openEditModal = (usuario) => {
        setCurrentUsuario(usuario);
        setShowEditModal(true);
    };

    const closeEditModal = () => setShowEditModal(false);

    const handleEditUsuario = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedUsuario = {
            nombre_usuario: formData.get('campo_nombreU'),
            apellido_usuario: formData.get('campo_apellido'),
            celular_usuario: formData.get('campo_celular'),
            correo_electronico_usuario: formData.get('campo_correo'),
            usuario: formData.get('campo_usuario'),
            contrasena_usuario: formData.get('campo_contrasena'),
            rol_usuario: formData.get('campo_rol'),
            estado_usuario: formData.get('campo_estado')
        };
        await handleUpdateUsuario(currentUsuario.id_usuario, updatedUsuario);
        closeEditModal();
    };

    const handleToggleStatus = async (id, type) => {
        if (window.confirm('¿Estás seguro de que deseas cambiar el estado?')) {
            try {
                await axios.patch(`http://localhost:4000/api/${type}/${id}/estado`);
                if (type === 'usuarios') fetchUsuarios();
                if (type === 'productos') fetchProductos();
                if (type === 'pedidos') fetchPedidos();
                if (type === 'envios') fetchEnvios();
            } catch (error) {
                console.error(`Error al cambiar el estado del ${type.slice(0, -1)}:`, error);
            }
        }
    };

    const handleAddPedido = () => {
        alert('Agregar nuevo pedido');
    };

    const handleSearchPedidos = (event) => {
        const query = event.target.value.toLowerCase();
        // Implement the search logic for pedidos
        fetchPedidos();
        setPedidos(pedidos.filter(pedido =>
            pedido.id_pedido.toLowerCase().includes(query) ||
            pedido.fecha_pedido.toLowerCase().includes(query) ||
            pedido.documento.toLowerCase().includes(query) ||
            pedido.total_pagado.toLowerCase().includes(query) ||
            pedido.estado_pedido.toLowerCase().includes(query)
        ));
    };

    return (
        <div className="App">
            <Header />
            <div className="admi1">
                <div className="admi2">
                    <h1 className="welcome-title">¡Bienvenido Administrador!</h1>
                    <p className="welcome-text">Utilice el menú de navegación para gestionar los usuarios, productos, pedidos, envíos y reportes.</p>
                </div>
                <div className="nav-buttons">
                    <button className="admi40" onClick={() => handleSectionChange('usuarios')}>Usuarios</button>
                    <button className="admi40" onClick={() => handleSectionChange('productos')}>Productos</button>
                    <button className="admi40" onClick={() => handleSectionChange('pedidos')}>Pedidos</button>
                    <button className="admi40" onClick={() => handleSectionChange('envios')}>Envíos</button>
                    <button className="admi40" onClick={() => handleSectionChange('reportes')}>Reportes</button>
                </div>

                {activeSection === 'usuarios' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Usuarios</h2>
                            <input type="text" id="search-usuarios" className="admi8" placeholder="Buscar usuario..." value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button className="admi4" onClick={() => alert('Agregar nuevo usuario')}>Agregar Usuario</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Dirección</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.length > 0 ? (
                                    usuarios.map(usuario => (
                                        <tr key={usuario.documento} className={usuario.estado_usuario === 0 ? 'inactive' : ''}>
                                            <td>{usuario.documento}</td>
                                            <td>{usuario.nombre_usuario}</td>
                                            <td>{usuario.apellido_usuario}</td>
                                            <td>{usuario.correo_electronico_usuario}</td>
                                            <td>{usuario.direccion}</td>
                                            <td>{usuario.rol_usuario}</td>
                                            <td>{usuario.estado_usuario === 1 ? 'Activo' : 'Inactivo'}</td>
                                            <td>
                                                <div className="actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => openEditModal(usuario)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={usuario.estado_usuario === 1 ? faToggleOn : faToggleOff}
                                                        className="icon-toggle"
                                                        onClick={() => handleToggleStatus(usuario.documento, 'usuarios')}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No hay usuarios disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'productos' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Productos</h2>
                            <input type="text" id="search-productos" className="admi8" placeholder="Buscar producto..." value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button className="admi4" onClick={() => alert('Agregar nuevo producto')}>Agregar Producto</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length > 0 ? (
                                    productos.map(producto => (
                                        <tr key={producto.id_producto} className={producto.estado_producto === 'Inactivo' ? 'inactive' : ''}>
                                            <td>{producto.id_producto}</td>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.precio_producto}</td>
                                            <td>{producto.categoria_producto}</td>
                                            <td>{producto.stock_producto}</td>
                                            <td>
                                                <div className="actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => alert(`Editar producto ${producto.id_producto}`)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={producto.estado_producto === 'Activo' ? faToggleOn : faToggleOff}
                                                        className="icon-toggle"
                                                        onClick={() => handleToggleStatus(producto.id_producto, 'productos')}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No hay productos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'pedidos' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Pedidos</h2>
                            <input type="text" id="search-pedidos" className="admi8" placeholder="Buscar pedido..." value={searchQuery} onChange={handleSearchPedidos} />
                        </div>
                        <button className="admi4" onClick={handleAddPedido}>Agregar Pedido</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length > 0 ? (
                                    pedidos.map(pedido => (
                                        <tr key={pedido.id_pedido} className={pedido.estado_pedido === 'Cancelado' ? 'inactive' : ''}>
                                            <td>{pedido.id_pedido}</td>
                                            <td>{pedido.fecha_pedido}</td>
                                            <td>{pedido.documento}</td>
                                            <td>{pedido.total_pagado}</td>
                                            <td>{pedido.estado_pedido}</td>
                                            <td>
                                                <div className="actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => alert(`Editar pedido ${pedido.id_pedido}`)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={pedido.estado_pedido === 'Cancelado' ? faToggleOff : faToggleOn}
                                                        className="icon-toggle"
                                                        onClick={() => handleToggleStatus(pedido.id_pedido, 'pedidos')}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No hay pedidos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'envios' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Envíos</h2>
                            <input type="text" id="search-envios" className="admi8" placeholder="Buscar envío..." value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button className="admi4" onClick={() => alert('Agregar nuevo envío')}>Agregar Envío</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Dirección</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {envios.length > 0 ? (
                                    envios.map(envio => (
                                        <tr key={envio.id_envio} className={envio.estado_envio === 'Cancelado' ? 'inactive' : ''}>
                                            <td>{envio.id_envio}</td>
                                            <td>{envio.fecha_envio}</td>
                                            <td>{envio.direccion_envio}</td>
                                            <td>{envio.estado_envio}</td>
                                            <td>
                                                <div className="actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => alert(`Editar envío ${envio.id_envio}`)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={envio.estado_envio === 'Cancelado' ? faToggleOff : faToggleOn}
                                                        className="icon-toggle"
                                                        onClick={() => handleToggleStatus(envio.id_envio, 'envios')}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No hay envíos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        <h2>Editar Usuario</h2>
                        <form onSubmit={handleEditUsuario}>
                            <label>
                                Nombre:
                                <input type="text" name="campo_nombreU" defaultValue={currentUsuario.nombre_usuario} />
                            </label>
                            <label>
                                Apellido:
                                <input type="text" name="campo_apellido" defaultValue={currentUsuario.apellido_usuario} />
                            </label>
                            <label>
                                Celular:
                                <input type="text" name="campo_celular" defaultValue={currentUsuario.celular_usuario} />
                            </label>
                            <label>
                                Correo:
                                <input type="email" name="campo_correo" defaultValue={currentUsuario.correo_electronico_usuario} />
                            </label>
                            <label>
                                Usuario:
                                <input type="text" name="campo_usuario" defaultValue={currentUsuario.usuario} />
                            </label>
                            <label>
                                Contraseña:
                                <input type="password" name="campo_contrasena" defaultValue={currentUsuario.contrasena_usuario} />
                            </label>
                            <label>
                                Rol:
                                <input type="text" name="campo_rol" defaultValue={currentUsuario.rol_usuario} />
                            </label>
                            <label>
                                Estado:
                                <select name="campo_estado" defaultValue={currentUsuario.estado_usuario}>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </label>
                            <button type="submit">Actualizar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
