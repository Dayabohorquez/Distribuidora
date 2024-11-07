import { faEdit, faPlus, faToggleOff, faToggleOn, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CreateProductModal from '../components/createprodmodal';
import EditModal from '../components/editmodal';
import EditProdModal from '../components/editprodmodal';
import Footer from '../components/Footer';
import Headerc from '../components/Header.c';
import ManageEventoModal from '../components/ManageEventoModal';
import ManageFechaEspecialModal from '../components/ManageFechaEspecialModal';
import ManageOptionModal from '../components/ManageOptionModal';
import ManageOrderModal from '../components/ManageOrderModal';
import ManageTipoFlorModal from '../components/ManageTipoFlorModal';
import '../index.css';

const App = () => {
    const [activeSection, setActiveSection] = useState('usuarios');
    const [filteredUsuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [currentProducto, setCurrentProduct] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [tiposFlor, setTiposFlor] = useState([]);
    const [currentTipoFlor, setCurrentTipoFlor] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [currentFechaEspecial, setCurrentFechaEspecial] = useState(null);
    const [currentEvento, setCurrentEvento] = useState(null);
    const [showEditProductModal, setIsEditModalOpen] = useState(false);
    const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
    const [fechasEspeciales, setFechasEspeciales] = useState([]);
    const [fechaEspecialModalOpen, setFechaEspecialModalOpen] = useState(false);
    const [notification, setNotification] = useState('');
    const [eventoModalOpen, setEventoModalOpen] = useState(null);
    const [tipoFlorModalOpen, setTipoFlorModalOpen] = useState(false);
    const [pagos, setPagos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortColumn, setSortColumn] = useState('documento');
    const [sortDirection, setSortDirection] = useState('asc');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentOpcion, setCurrentOpcion] = useState(null);
    const [opcionesAdicionales, setOpcionesAdicionales] = useState([]);

    // Llama a fetchPagos en useEffect
    useEffect(() => {
        fetchUsuarios();
        fetchProductos();
        fetchPedidos();
        fetchTiposFlor();
        fetchFechasEspeciales();
        fetchEventos();
        fetchPagos(); // Agregar esta línea
        fetchOpcionesAdicionales();
    }, []);

    useEffect(() => {
        if (activeSection === 'usuarios') fetchUsuarios();
        if (activeSection === 'productos') fetchProductos();
        if (activeSection === 'pedidos') fetchPedidos();
        if (activeSection === 'tiposFlor') fetchTiposFlor();
        if (activeSection === 'fechasEspeciales') fetchFechasEspeciales();
        if (activeSection === 'eventos') fetchEventos();
        if (activeSection === 'pagos') fetchPagos();
        if (activeSection === 'opciones') fetchOpcionesAdicionales();
    }, [activeSection]);

    const fetchPagos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pagos');
            setPagos(response.data); // Asegúrate de que response.data es un array
        } catch (error) {
            console.error('Error al obtener los pagos:', error);
        }
    };

    const handleUpdateEstadoPago = async (id_pago, nuevoEstado) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/pagos/${id_pago}/estado`, { estado_pago: nuevoEstado });
            showNotification('Estado de pago actualizado exitosamente.');

            // Actualiza solo el pago que se ha cambiado
            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id_pago === id_pago ? { ...pago, estado_pago: nuevoEstado } : pago
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado del pago:', error);
        }
    };

    // Función para obtener usuarios
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            showNotification('Error al obtener los usuarios.');
        }
    };

    // Función para actualizar un usuario
    const handleUpdateUsuario = async (documento, updatedUsuario) => {
        if (!documento) {
            console.error('El documento no está definido');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/usuario/${documento}`, updatedUsuario);
            if (response.status === 200) {
                fetchUsuarios();
                showNotification('Usuario actualizado exitosamente.');
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al actualizar el usuario.');
            }
        } catch (error) {
            console.error('Error al actualizar el usuario:', error.response ? error.response.data : error.message);
            showNotification('Error al actualizar el usuario.');
        }
    };

    // Función para actualizar el rol de un usuario
    const handleUpdateRolUsuario = async (documento, nuevoRol) => {
        if (!documento || !nuevoRol) {
            console.error('El documento o el nuevo rol no están definidos');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/usuario/${documento}/rol`, { rol_usuario: nuevoRol });
            if (response.status === 200) {
                fetchUsuarios();
                showNotification('Rol actualizado exitosamente.');
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al actualizar el rol.');
            }
        } catch (error) {
            console.error('Error al actualizar el rol:', error.response ? error.response.data : error.message);
            showNotification('Error al actualizar el rol.');
        }
    };

    // Función para cambiar el estado de un usuario
    const handleToggleStatus = async (documento) => {
        if (!documento) {
            console.error('El documento no está definido');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:4000/api/usuario/${documento}/estado`);
            if (response.status === 200) {
                fetchUsuarios();
                showNotification('Estado del usuario cambiado exitosamente.');
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al cambiar el estado del usuario.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del usuario:', error);
            showNotification('Error al cambiar el estado del usuario.');
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    // Abrir el modal de edición
    const openEditModal = (usuario) => {
        setCurrentUsuario(usuario);
        setShowEditModal(true);
    };

    // Cerrar el modal de edición
    const closeEditModal = () => {
        setShowEditModal(false);
        setCurrentUsuario(null);
    };

    // Manejar la edición de un usuario
    const handleEditUsuario = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedUsuario = {
            nombre_usuario: formData.get('campo_nombreU'),
            apellido_usuario: formData.get('campo_apellido'),
            direccion: formData.get('campo_direccion'),
            correo_electronico_usuario: formData.get('campo_correo'),
        };

        try {
            await handleUpdateUsuario(currentUsuario.documento, updatedUsuario);
            closeEditModal();
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
        }
    };

    // Mostrar notificaciones
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    // Filtrar usuarios según la búsqueda
    const filteredAndSortedUsuarios = filteredUsuarios.filter((usuario) => {
        const query = searchQuery.toLowerCase();
        return (
            String(usuario.documento || '').toLowerCase().includes(query) ||
            String(usuario.nombre_usuario || '').toLowerCase().includes(query) ||
            String(usuario.apellido_usuario || '').toLowerCase().includes(query) ||
            String(usuario.correo_electronico_usuario || '').toLowerCase().includes(query) ||
            String(usuario.direccion || '').toLowerCase().includes(query) ||
            String(usuario.fecha_registro).toLowerCase().includes(query) || // Asegúrate de que este campo esté bien definido
            String(usuario.rol_usuario || '').toLowerCase().includes(query) ||
            (usuario.estado_usuario === 1 ? 'activo' : 'inactivo').includes(query)
        );
    });    
    
    const columnMapUsuario = {
        'documento': 'documento',
        'nombre': 'nombre_usuario',
        'apellido': 'apellido_usuario',
        'correo': 'correo_electronico_usuario',
        'direccion': 'direccion',
        'fecha_registro': 'fecha_registro',
        'rol': 'rol_usuario',
        'estado': 'estado_usuario'
    };

    // Ordenar usuarios
    const sortedUsuarios = [...filteredAndSortedUsuarios].sort((a, b) => {
        const aValue = a[columnMapUsuario[sortColumn]];
        const bValue = b[columnMapUsuario[sortColumn]];
    
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
    const totalPages = Math.ceil(sortedUsuarios.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsuarios = sortedUsuarios.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            showNotification('Error al obtener los productos.');
        }
    };

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/images/producto');
            setImageList(response.data);
        } catch (error) {
            console.error('Error al obtener imágenes:', error);
            showNotification('Error al obtener imágenes.');
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpdateProducto = async (idProducto, formData) => {
        if (!idProducto) {
            console.error('El id Producto no está definido');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:4000/api/productos/${idProducto}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                fetchProductos();
                showNotification('Producto actualizado exitosamente.');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error.response ? error.response.data : error.message);
            showNotification('Error al actualizar el producto.');
        }
    };

    const handleToggleProductStatus = async (idProducto) => {
        if (!idProducto) {
            console.error('El ID del producto no está definido');
            return;
        }

        try {
            // Obtener el producto actual
            const productoActual = productos.find(p => p.id_producto === idProducto);
            if (!productoActual) {
                console.error('Producto no encontrado');
                return;
            }

            // Determinar el nuevo estado
            const nuevoEstado = !productoActual.estado_producto;

            // Hacer la solicitud para actualizar el estado
            const response = await axios.patch(`http://localhost:4000/api/productos/${idProducto}/estado`, {
                estado: nuevoEstado,
            });

            if (response.status === 200) {
                fetchProductos(); // Actualizar la lista de productos
                showNotification(`Estado del producto cambiado a ${nuevoEstado ? 'activo' : 'inactivo'} exitosamente.`);
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al cambiar el estado del producto.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del producto:', error);
            showNotification('Error al cambiar el estado del producto.');
        }
    };

    const openEditProductModal = (producto) => {
        setCurrentProduct(producto);
        setIsEditModalOpen(true);
    };

    const closeEditProductModal = () => {
        setIsEditModalOpen(false);
        setCurrentProduct(null);
    };

    const openCreateProductModal = () => setShowCreateProductModal(true);
    const closeCreateProductModal = () => setShowCreateProductModal(false);

    const handleCreateProducto = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const productoData = {
            codigo_producto: formData.get('campo_codigo'),
            nombre_producto: formData.get('campo_nombre'),
            descripcion_producto: formData.get('campo_descripcion'),
            precio_producto: parseFloat(formData.get('campo_precio')),
            cantidad_disponible: parseInt(formData.get('campo_cantidad')) || 0, // Asegurar que tenga un valor por defecto
            id_tipo_flor: parseInt(formData.get('campo_idTipoFlor')),
            id_evento: parseInt(formData.get('campo_idEvento')),
            id_fecha_especial: parseInt(formData.get('campo_idFechaEspecial')),
        };

        const fotoFile = formData.get('campo_foto');
        if (fotoFile) {
            formData.append('foto_Producto', fotoFile);
        }

        // Añadir los datos del producto a FormData
        for (const key in productoData) {
            formData.append(key, productoData[key]);
        }

        try {
            const response = await axios.post('http://localhost:4000/api/productos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProductos();
            closeCreateProductModal();
            showNotification('Producto creado exitosamente.');
        } catch (error) {
            console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
            showNotification('Error al crear el producto.');
        }
    };

    const handleUpdateCantidad = async (idProducto, nuevaCantidad) => {
        if (!idProducto) {
            console.error('El ID del producto no está definido');
            return;
        }
    
        // Verificar que la nueva cantidad sea un número
        if (typeof nuevaCantidad !== 'number') {
            console.error('La nueva cantidad debe ser un número');
            showNotification('La nueva cantidad debe ser un número.');
            return;
        }
    
        // Verificar que la nueva cantidad no sea negativa
        if (nuevaCantidad < 0) {
            console.error('La nueva cantidad no puede ser negativa');
            showNotification('La nueva cantidad no puede ser negativa.');
            return;
        }
    
        try {
            const response = await axios.patch(`http://localhost:4000/api/productos/${idProducto}/cantidad`, {
                nuevaCantidad // Enviar la nueva cantidad con el nombre correcto
            });
    
            if (response.status === 200) {
                fetchProductos(); // Actualizar la lista de productos
                showNotification('Cantidad disponible actualizada exitosamente.');
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al actualizar la cantidad del producto.');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error);
            showNotification('Error al actualizar la cantidad del producto.');
        }
    };      

    const handleEditProducto = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const updatedProducto = {
            codigo_producto: formData.get('campo_codigo'),
            nombre_producto: formData.get('campo_nombre'),
            descripcion_producto: formData.get('campo_descripcion'),
            precio_producto: parseFloat(formData.get('campo_precio')),
            id_tipo_flor: parseInt(formData.get('campo_idTipoFlor')),
            id_evento: parseInt(formData.get('campo_idEvento')),
            id_fecha_especial: parseInt(formData.get('campo_idFechaEspecial')),
        };

        const fotoFile = formData.get('campo_foto');
        if (fotoFile) {
            formData.append('foto_Producto', fotoFile);
        }

        // Añadir los datos actualizados a FormData
        Object.entries(updatedProducto).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await handleUpdateProducto(currentProducto.id_producto, formData);
            closeEditProductModal();
        } catch (error) {
            console.error('Error al actualizar el producto:', error.response ? error.response.data : error.message);
        }
    };

    const handleIncrementarCantidad = async (producto) => {
        const nuevaCantidad = producto.cantidad_disponible + 1; // Incrementar en 1

        try {
            await handleUpdateCantidad(producto.id_producto, nuevaCantidad);

            // Verificar si la nueva cantidad es cero
            if (nuevaCantidad === 0) {
                // Si la cantidad llega a cero, inactivar el producto
                await handleToggleProductStatus(producto.id_producto, false);
                showNotification('Producto inactivado porque la cantidad llegó a cero.');
            } else if (producto.estado_producto === false) {
                await handleToggleProductStatus(producto.id_producto, true);
                showNotification('Producto activado porque se ha agregado cantidad.');
            }

            fetchProductos(); // Actualizar la lista de productos
        } catch (error) {
            console.error('Error al incrementar la cantidad:', error);
            showNotification('Error al incrementar la cantidad del producto.');
        }
    };

    const filteredAndSortedProductos = productos.filter((producto) => {
        const query = searchQuery.toLowerCase();
        return (
            String(producto.id_producto || '').toLowerCase().includes(query) ||
            String(producto.codigo_producto || '').toLowerCase().includes(query) ||
            (producto.nombre_producto || '').toLowerCase().includes(query) ||
            (producto.precio_producto !== null ? String(Math.floor(producto.precio_producto)) : '').includes(query) ||
            String(producto.cantidad_disponible !== undefined ? producto.cantidad_disponible : 0).includes(query) ||
            (producto.descripcion_producto || '').toLowerCase().includes(query) ||
            (producto.estado_producto ? 'activo' : 'inactivo').includes(query)
        );
    });

    const columnMapProducto = {
        'ID': 'id_producto',
        'Código': 'codigo_producto',
        'Nombre': 'nombre_producto',
        'Precio': 'precio_producto',
        'Stock': 'cantidad_disponible',
        'Descripción': 'descripcion_producto',
        'Foto': 'foto_ProductoURL',
        'Estado': 'estado_producto'
    };

    // Ordenar productos
    const sortedProductos = [...filteredAndSortedProductos].sort((a, b) => {
    const aValue = a[columnMapProducto[sortColumn]];
    const bValue = b[columnMapProducto[sortColumn]];

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
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
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };    

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos'); // Cambiado a /api/pedidos
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            showNotification('Error al obtener pedidos.');
        }
    };

    // Cambiar el estado de un pedido
    const handleTogglePedidoStatus = async (idPedido, nuevoEstado) => {
        if (!idPedido) {
            console.error('El ID del pedido no está definido');
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:4000/api/pedidos/${idPedido}/estado`, {
                nuevo_estado: nuevoEstado
            });

            if (response.status === 200) {
                const updatedPedidos = pedidos.map(pedido =>
                    pedido.id_pedido === idPedido ? { ...pedido, estado_pedido: nuevoEstado } : pedido
                );
                setPedidos(updatedPedidos);
                showNotification('Estado del pedido actualizado.');
            } else {
                console.error('Error en la respuesta del servidor:', response.status);
                showNotification('Error al actualizar el estado del pedido.');
            }
        } catch (error) {
            console.error('Error al cambiar el estado del pedido:', error);
            showNotification('Error al cambiar el estado del pedido.');
        }
    };

    // Crear un nuevo pedido
    const handleCreatePedido = async (formData) => {
        const pedidoData = {
            fecha_pedido: formData.get('campo_fecha'),
            total_pagado: parseFloat(formData.get('campo_total')),
            documento: formData.get('campo_documento'),
            pago_id: parseInt(formData.get('campo_pagoId')),
        };

        if (isNaN(pedidoData.total_pagado) || isNaN(pedidoData.pago_id)) {
            console.error('Datos no válidos:', pedidoData);
            showNotification('Datos no válidos al crear el pedido.');
            return;
        }

        // Añadir foto al FormData
        const fotoInput = document.querySelector('input[name="campo_foto"]');
        if (fotoInput && fotoInput.files.length > 0) {
            formData.append('foto_Pedido', fotoInput.files[0]);
        }

        for (const key in pedidoData) {
            formData.append(key, pedidoData[key]);
        }

        try {
            await axios.post('http://localhost:4000/api/pedidos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchPedidos();
            closeModal();
            showNotification('Pedido creado exitosamente.');
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            showNotification('Error al crear el pedido.');
        }
    };

    // Actualizar un pedido existente
    const handleUpdatePedido = async (formData) => {
        const pedidoData = {
            fecha_pedido: formData.get('campo_fecha'),
            total_pagado: parseFloat(formData.get('campo_total')),
            documento: formData.get('campo_documento'),
            pago_id: parseInt(formData.get('campo_pagoId')),
        };

        // Añadir foto al FormData si existe
        const fotoInput = document.querySelector('input[name="campo_foto"]');
        if (fotoInput && fotoInput.files.length > 0) {
            formData.append('foto_Pedido', fotoInput.files[0]);
        }

        for (const key in pedidoData) {
            formData.append(key, pedidoData[key]);
        }

        try {
            await axios.put(`http://localhost:4000/api/pedidos/${currentOrder.id_pedido}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchPedidos();
            closeModal();
            showNotification('Pedido actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            showNotification('Error al actualizar el pedido.');
        }
    };

    const openCreateModal = () => {
        setCurrentOrder(null);
        setModalOpen(true);
    };

    const openEditPedidoModal = (pedido) => {
        setCurrentOrder(pedido);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentOrder(null);
    };


    const filteredPedidos = pedidos.filter(pedido =>
        new Date(pedido.fecha_pedido).toLocaleDateString().includes(searchQuery) ||
        pedido.id_pedido.toString().includes(searchQuery)
    );
    const filteredAndSortedPedidos = pedidos.filter((pedido) => {
        const query = searchQuery.toLowerCase();
        return (
            String(pedido.id_pedido || '').toLowerCase().includes(query) ||
            String(pedido.fecha_pedido || '').toLowerCase().includes(query) ||
            String(pedido.documento || '').toLowerCase().includes(query) ||
            `${pedido.nombre_usuario || ''} ${pedido.apellido_usuario || ''}`.toLowerCase().includes(query) ||
            (pedido.total_pagado !== null ? String(Math.floor(pedido.total_pagado)) : '').includes(query) ||
            (pedido.estado_pedido || '').toLowerCase().includes(query)
        );
    });

    const columnMapPedido = {
        'ID': 'id_pedido',
        'Fecha': 'fecha_pedido',
        'Documento Cliente': 'documento',
        'Nombre Cliente': 'nombre_usuario',
        'Total': 'total_pagado',
        'Estado': 'estado_pedido',
    };

    // Ordenar usuarios
    const sortedPedidos = [...filteredAndSortedPedidos].sort((a, b) => {
        const aValue = a[columnMapPedido[sortColumn]];
        const bValue = b[columnMapPedido[sortColumn]];
    
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

    const openEventoModal = () => {
        setIsEventoModalOpen(true);
    };

    const fetchTiposFlor = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/tipos-flor');
            setTiposFlor(response.data);
        } catch (error) {
            console.error('Error al obtener tipos de flor:', error);
        }
    };

    const handleAddTipoFlor = async (tipoFlorData) => {
        const nombreTipoFlor = tipoFlorData.get('nombre_tipo_flor');

        try {
            const response = await axios.post('http://localhost:4000/api/tipo-flor', { nombre_tipo_flor: nombreTipoFlor });
            console.log('Respuesta del servidor:', response.data);
            fetchTiposFlor(); // Función para refrescar la lista de tipos de flores
            showNotification('Tipo de flor agregado exitosamente.');
            closeTipoFlorModal(); // Cerrar el modal aquí
        } catch (error) {
            console.error('Error al agregar tipo de flor:', error.response ? error.response.data : error.message);
            showNotification('Error al agregar el tipo de flor: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleEditTipoFlor = async (tipoFlorData) => {
        if (!currentTipoFlor || !currentTipoFlor.id_tipo_flor) {
            console.error('No se puede editar el tipo de flor, el tipo no es válido.');
            showNotification('Tipo de flor no válido.');
            return;
        }

        const nombreTipoFlor = tipoFlorData.get('nombre_tipo_flor');

        try {
            await axios.put(`http://localhost:4000/api/tipo-flor/${currentTipoFlor.id_tipo_flor}`, {
                nombre_tipo_flor: nombreTipoFlor,
            });
            fetchTiposFlor(); // Función para refrescar la lista de tipos de flores
            closeTipoFlorModal();
            showNotification('Tipo de flor actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar tipo de flor:', error.response ? error.response.data : error.message);
            showNotification('Error al actualizar el tipo de flor.');
        }
    };

    const handleDeleteTipoFlor = async (id_tipo_flor) => {
        try {
            await axios.delete(`http://localhost:4000/api/tipo-flor/${id_tipo_flor}`);
            fetchTiposFlor();
            showNotification('Tipo de flor eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar tipo de flor:', error);
            showNotification('Error al eliminar el tipo de flor.');
        }
    };

    useEffect(() => {
        fetchTiposFlor(); // Cargar tipos de flor al montar el componente
    }, []);

    const openAddTipoFlorModal = () => {
        setCurrentTipoFlor(null);
        setTipoFlorModalOpen(true);
    };

    const openEditTipoFlorModal = (tipoFlor) => {
        setCurrentTipoFlor(tipoFlor);
        setTipoFlorModalOpen(true);
    };

    const closeTipoFlorModal = () => {
        setTipoFlorModalOpen(false);
        setCurrentTipoFlor(null);
    };

    const fetchFechasEspeciales = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/fechas-especiales');
            setFechasEspeciales(response.data);
        } catch (error) {
            console.error('Error al obtener las fechas especiales:', error);
            showNotification('Error al obtener las fechas especiales.');
        }
    };

    const handleAddFechaEspecial = async (fechaEspecialData) => {
        try {
            const formData = new FormData();
            formData.append('nombre_fecha_especial', fechaEspecialData.get('nombre_fecha_especial'));

            await axios.post('http://localhost:4000/api/fechas-especiales', formData);
            fetchFechasEspeciales();
            closeFechaEspecialModal();
            showNotification('Fecha especial añadida exitosamente.');
        } catch (error) {
            console.error('Error al agregar fecha especial:', error.response ? error.response.data : error.message);
            showNotification('Error al agregar fecha especial.');
        }
    };

    const handleEditFechaEspecial = async (formData) => {
        if (!currentFechaEspecial || !currentFechaEspecial.id_fecha_especial) {
            console.error('No se puede editar la fecha especial, la fecha no es válida.');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/fechas-especiales/${currentFechaEspecial.id_fecha_especial}`, formData);
            fetchFechasEspeciales(); // Refresca la lista después de la actualización
            closeFechaEspecialModal();
            showNotification('Fecha especial actualizada exitosamente.');
        } catch (error) {
            console.error('Error al actualizar fecha especial:', error);
            showNotification('Error al actualizar la fecha especial.');
        }
    };

    const handleDeleteFechaEspecial = async (id_fecha_especial) => {
        try {
            await axios.delete(`http://localhost:4000/api/fechas-especiales/${id_fecha_especial}`);
            fetchFechasEspeciales();
            showNotification('Fecha especial eliminada exitosamente.');
        } catch (error) {
            console.error('Error al eliminar fecha especial:', error);
            showNotification('Error al eliminar la fecha especial.');
        }
    };

    useEffect(() => {
        fetchFechasEspeciales();
    }, []);

    const openFechaEspecialModal = () => {
        setCurrentFechaEspecial(null);
        setFechaEspecialModalOpen(true);
    };

    const handleOpenEditModal = (fechaEspecial) => {
        setCurrentFechaEspecial(fechaEspecial);
        setFechaEspecialModalOpen(true);
    };

    const closeFechaEspecialModal = () => {
        setFechaEspecialModalOpen(false);
        setCurrentFechaEspecial(null);
    };

    const filteredAndSortedFechasEspeciales = fechasEspeciales.filter((fecha) => {
        const query = searchQuery.toLowerCase();
        return (
            String(fecha.id_fecha_especial || '').toLowerCase().includes(query) ||
            (fecha.nombre_fecha_especial || '').toLowerCase().includes(query) ||
            new Date(fecha.fecha).toLocaleDateString().includes(query)
        );
    });

    const columnMapFechasEspeciales = {
        'ID': 'id_fecha_especial',
        'Nombre': 'nombre_fecha_especial',
    };

    // Ordenar FechasEspeciales
    const sortedFechasEspeciales = [...filteredAndSortedFechasEspeciales].sort((a, b) => {
        const aValue = a[columnMapFechasEspeciales[sortColumn]];
        const bValue = b[columnMapFechasEspeciales[sortColumn]];
    
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
    const totalPagesFechasEspeciales = Math.ceil(sortedFechasEspeciales.length / rowsPerPage);
    const startIndexFechasEspeciales = (currentPage - 1) * rowsPerPage;
    const endIndexFechasEspeciales = startIndexFechasEspeciales + rowsPerPage;
    const paginatedFechasEspeciales = sortedFechasEspeciales.slice(startIndexFechasEspeciales, endIndexFechasEspeciales);

    const handleSearchChangeFechasEspeciales = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortFechasEspeciales = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const fetchEventos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/eventos');
            if (Array.isArray(response.data)) {
                setEventos(response.data);
            } else {
                console.error('Expected an array but received:', response.data);
            }
        } catch (error) {
            console.error('Error al obtener eventos:', error.response ? error.response.data : error.message);
            showNotification('Error al obtener eventos.'); // Notificación de error
        }
    };

    const handleAddEvento = async (eventoData) => {
        const formData = new FormData();
        formData.append('nombre_evento', eventoData.get('nombre_evento'));
        formData.append('descripcion', eventoData.get('descripcion')); // Agregar descripción

        if (eventoData.get('foto_evento')) {
            formData.append('foto_evento', eventoData.get('foto_evento'));
        }

        try {
            const response = await axios.post('http://localhost:4000/api/eventos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Respuesta del servidor:', response.data);
            fetchEventos();
            showNotification('Evento agregado exitosamente.');
            closeEventoModal();  // Cerrar el modal aquí
        } catch (error) {
            console.error('Error al agregar evento:', error.response ? error.response.data : error.message);
            showNotification('Error al agregar el evento: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleEditEvento = async (eventoData) => {
        if (!currentEvento || !currentEvento.id_evento) {
            console.error('No se puede editar el evento, el evento no es válido.');
            showNotification('Evento no válido.');
            return;
        }

        const formData = new FormData();
        formData.append('nombre_evento', eventoData.get('nombre_evento')); // Asegúrate de obtener el valor correctamente
        formData.append('descripcion', eventoData.get('descripcion')); // Agregar descripción

        if (eventoData.get('foto_evento')) {
            formData.append('foto_evento', eventoData.get('foto_evento'));
        }

        try {
            await axios.put(`http://localhost:4000/api/eventos/${currentEvento.id_evento}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchEventos();
            closeEventoModal();
            showNotification('Evento actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar evento:', error.response ? error.response.data : error.message);
            showNotification('Error al actualizar el evento.');
        }
    };

    const handleDeleteEvento = async (id_evento) => {
        try {
            await axios.delete(`http://localhost:4000/api/eventos/${id_evento}`);
            fetchEventos();
            showNotification('Evento eliminado exitosamente.'); // Notificación de éxito
        } catch (error) {
            console.error('Error al eliminar evento:', error.response ? error.response.data : error.message);
            showNotification('Error al eliminar el evento.'); // Notificación de error
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const openAddEventoModal = () => {
        setCurrentEvento(null);
        setEventoModalOpen(true);
    };

    const openEditEventoModal = (evento) => {
        setCurrentEvento(evento);
        setEventoModalOpen(true);
    };

    const closeEventoModal = () => {
        setEventoModalOpen(false);
        setCurrentEvento(null);
    };

    const filteredAndSortedEventos = eventos.filter((evento) => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        return (
            evento.id_evento.toString().includes(lowerCaseQuery) ||
            evento.nombre_evento.toLowerCase().includes(lowerCaseQuery) ||
            (evento.descripcion && evento.descripcion.toLowerCase().includes(lowerCaseQuery))
        );
    });

    const columnMapEventos = {
        'ID': 'id_evento',
        'Nombre': 'nombre_evento',
        'Descripción': 'descripcion'
    };

    // Ordenar Eventos
    const sortedEventos = [...filteredAndSortedEventos].sort((a, b) => {
        const aValue = a[columnMapEventos[sortColumn]];
        const bValue = b[columnMapEventos[sortColumn]];
    
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
    const totalPagesEventos = Math.ceil(sortedEventos.length / rowsPerPage);
    const startIndexEventos = (currentPage - 1) * rowsPerPage;
    const endIndexEventos = startIndexEventos + rowsPerPage;
    const paginatedEventos = sortedEventos.slice(startIndexEventos, endIndexEventos);

    const handleSearchChangeEventos = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortEventos = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const filteredAndSortedTiposFlor = tiposFlor.filter((tipoFlor) => {
        const query = searchQuery.toLowerCase();
        return (
            String(tipoFlor.id_tipo_flor || '').toLowerCase().includes(query) ||
            (tipoFlor.nombre_tipo_flor || '').toLowerCase().includes(query)
        );
    });

    const columnMapTiposFlor = {
        'ID': 'id_tipo_flor',
        'Nombre': 'nombre_tipo_flor',
    };

    // Ordenar usuarios
    const sortedTiposFlor = [...filteredAndSortedTiposFlor].sort((a, b) => {
        const aValue = a[columnMapTiposFlor[sortColumn]];
        const bValue = b[columnMapTiposFlor[sortColumn]];
    
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
    const totalPagesTiposFlor = Math.ceil(sortedTiposFlor.length / rowsPerPage);
    const startIndexTiposFlor = (currentPage - 1) * rowsPerPage;
    const endIndexTiposFlor = startIndexTiposFlor + rowsPerPage;
    const paginatedTiposFlor = sortedTiposFlor.slice(startIndexTiposFlor, endIndexTiposFlor);

    const handleSearchChangeTiposFlor = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortTiposFlor = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const filteredAndSortedPagos = pagos.filter((pago) => {
        const query = searchQuery.toLowerCase();
        return (
            String(pago.id_pago).toLowerCase().includes(query) ||
            String(pago.documento || '').toLowerCase().includes(query) ||
            String(new Date(pago.fecha_pago).toLocaleDateString()).toLowerCase().includes(query) ||
            String(pago.metodo_pago || '').toLowerCase().includes(query) ||
            String(pago.subtotal_pago).toLowerCase().includes(query) ||
            String(pago.total_pago).toLowerCase().includes(query) ||
            String(pago.estado_pago || '').toLowerCase().includes(query)
        );
    });    


    const columnMaPagos = {
        'ID Pago': 'id_pago',
        'Documento': 'documento',
        'Fecha': 'fecha_pago',
        'Método de Pago': 'metodo_pago',
        'Subtotal': 'subtotal_pago',
        'Total': 'total_pago',
        'Estado': 'estado_pago',
    };

    // Ordenar opciones
    const sortedPagos = [...filteredAndSortedPagos].sort((a, b) => {
        const aValue = a[columnMaPagos[sortColumn]];
        const bValue = b[columnMaPagos[sortColumn]];
    
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
    const totalPagesPagos = Math.ceil(sortedPagos.length / rowsPerPage);
    const startIndexPagos = (currentPage - 1) * rowsPerPage;
    const endIndexPagos = startIndexPagos + rowsPerPage;
    const paginatedPagos = sortedPagos.slice(startIndexPagos, endIndexPagos);

    const handleSearchChangePagos = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    const handleSortPagos = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
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

    const createOpcionAdicional = async (nuevaOpcion) => {
        try {
            await axios.post('http://localhost:4000/api/opciones-adicionales', nuevaOpcion);
            fetchOpcionesAdicionales();
            closeModal1();
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
            closeModal1();
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

    const closeModal1 = () => {
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
        'Precio Adicional': 'precio_adicional',
    };

    // Ordenar opciones
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
            <div className="admin-container">
                <div className="admin-header">
                    <h1 className="admin-title">¡Bienvenido Administrador!</h1>
                    <p className="admin-description">Utilice el menú de navegación para gestionar los usuarios, productos, pedidos, envíos, tipos de flores, fechas especiales, eventos y pagos.</p>
                </div>
                <div className="admin-nav">
                    <button className="admin-nav-button" onClick={() => handleSectionChange('usuarios')}>Usuarios</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('productos')}>Productos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('pedidos')}>Pedidos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('tiposFlor')}>Tipos de Flores</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('fechasEspeciales')}>Fechas Especiales</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('eventos')}>Eventos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('pagos')}>Pagos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('opciones')}>Opciones Adicionales</button>
                </div>

                {activeSection === 'usuarios' && (
    <div className="admin-section">
        <div className="admin-section-header">
            <h2>Usuarios</h2>
            <input
                type="text"
                id="search-usuarios"
                className="admin-search"
                placeholder="Buscar usuario"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <div className='admi'>
            <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
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
                    {['documento', 'nombre', 'apellido', 'correo', 'direccion', 'fecha_registro', 'rol', 'estado'].map((col) => (
                        <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
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
                {paginatedUsuarios.length > 0 ? (
                    paginatedUsuarios.map(usuario => (
                        <tr key={usuario.documento} className={usuario.estado_usuario === 0 ? 'inactive' : ''}>
                            <td>{usuario.documento}</td>
                            <td>{usuario.nombre_usuario}</td>
                            <td>{usuario.apellido_usuario}</td>
                            <td>{usuario.correo_electronico_usuario}</td>
                            <td>{usuario.direccion}</td>
                            <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                            <td>
                                <select
                                    value={usuario.rol_usuario}
                                    onChange={(e) => handleUpdateRolUsuario(usuario.documento, e.target.value)}
                                    className="admin-role-select"
                                >
                                    <option value="Cliente">Cliente</option>
                                    <option value="Vendedor">Vendedor</option>
                                    <option value="Domiciliario">Domiciliario</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </td>
                            <td>{usuario.estado_usuario === 1 ? 'Activo' : 'Inactivo'}</td>
                            <td>
                                <div className="admin-actions">
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="admin-icon-edit"
                                        onClick={() => openEditModal(usuario)}
                                    />
                                    <FontAwesomeIcon
                                        icon={usuario.estado_usuario === 1 ? faToggleOn : faToggleOff}
                                        className="icon-toggle"
                                        onClick={() => handleToggleStatus(usuario.documento)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9">No hay usuarios disponibles</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Siguiente
            </button>
        </div>
    </div>
)}

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
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-add-button" onClick={openCreateProductModal}>Añadir Nuevo Producto</button>
                        {showCreateProductModal && (
                            <CreateProductModal
                                isOpen={showCreateProductModal}
                                onClose={closeCreateProductModal}
                                fetchProductos={fetchProductos}
                            />
                        )}  
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {['ID', 'Código', 'Nombre', 'Precio', 'Stock', 'Descripción', 'Foto', 'Estado'].map((col) => (
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
                                            <td>{producto.id_producto || 'N/A'}</td>
                                            <td>{producto.codigo_producto || 'N/A'}</td>
                                            <td>{producto.nombre_producto || 'N/A'}</td>
                                            <td>{producto.precio_producto ? `${Math.floor(producto.precio_producto)}` : 'N/A'}</td>
                                            <td>{producto.cantidad_disponible !== undefined ? producto.cantidad_disponible : 0}</td>
                                            <td>{producto.descripcion_producto || 'N/A'}</td>
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
                                            <td>{producto.estado_producto ? 'Activo' : 'Inactivo'}</td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => openEditProductModal(producto)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={producto.estado_producto ? faToggleOn : faToggleOff}
                                                        className="icon-toggle"
                                                        onClick={() => handleToggleProductStatus(producto.id_producto)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                        className="icon-update"
                                                        onClick={() => handleIncrementarCantidad(producto)}
                                                        title="Incrementar cantidad"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No hay productos disponibles</td>
                                    </tr>
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
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-add-button" onClick={openCreateModal}>Crear Nuevo Pedido</button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {['ID', 'Fecha', 'Documento Cliente', 'Nombre Cliente', 'Total', 'Estado'].map((col) => (
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
                                {Array.isArray(paginatedPedidos) && paginatedPedidos.length > 0 ? (
                                    paginatedPedidos.map(pedido => (
                                        <tr key={pedido.id_pedido} className={pedido.estado_pedido === 'Cancelado' ? 'inactive' : ''}>
                                            <td>{pedido.id_pedido}</td>
                                            <td>{pedido.fecha_pedido}</td>
                                            <td>{pedido.documento}</td>
                                            <td>{pedido.nombre_usuario} {pedido.apellido_usuario}</td>
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
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="admin-icon-edit"
                                                        onClick={() => openEditPedidoModal(pedido)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No hay pedidos disponibles</td>
                                    </tr>
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

                {activeSection === 'tiposFlor' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Tipos de <br></br>Flores</h2>
                            <input
                                type="text"
                                id="search-tipos-flor"
                                className="admin-search"
                                placeholder="Buscar tipo de flor..."
                                value={searchQuery}
                                onChange={handleSearchChangeTiposFlor}
                            />
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-add-button" onClick={openAddTipoFlorModal}>
                            Agregar Nuevo Tipo de Flor
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {['ID', 'Nombre'].map((col) => (
                                        <th key={col} onClick={() => handleSortTiposFlor(col)} style={{ cursor: 'pointer' }}>
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
                                {paginatedTiposFlor.length > 0 ? (
                                    paginatedTiposFlor.map(tipoFlor => (
                                        <tr key={tipoFlor.id_tipo_flor}>
                                            <td>{tipoFlor.id_tipo_flor}</td>
                                            <td>{tipoFlor.nombre_tipo_flor}</td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        title="Editar tipo de flor"
                                                        onClick={() => openEditTipoFlorModal(tipoFlor)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="icon-delete"
                                                        title="Eliminar tipo de flor"
                                                        onClick={() => handleDeleteTipoFlor(tipoFlor.id_tipo_flor)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-tipos-flor-message">
                                            No hay tipos de flores disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPagesTiposFlor}</span>
                            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesTiposFlor))} disabled={currentPage === totalPagesTiposFlor}>
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}


                {activeSection === 'fechasEspeciales' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Fechas <br></br>Especiales</h2>
                            <input
                                type="text"
                                id="search-fechas-especiales"
                                className="admin-search"
                                placeholder="Buscar fecha especial..."
                                value={searchQuery}
                                onChange={handleSearchChangeFechasEspeciales}
                            />
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-add-button" onClick={openFechaEspecialModal}>
                            Agregar Nueva Fecha Especial
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {['ID', 'Nombre'].map((col) => (
                                        <th key={col} onClick={() => handleSortFechasEspeciales(col)} style={{ cursor: 'pointer' }}>
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
                                {paginatedFechasEspeciales.length > 0 ? (
                                    paginatedFechasEspeciales.map(fecha => (
                                        <tr key={fecha.id_fecha_especial}>
                                            <td>{fecha.id_fecha_especial}</td>
                                            <td>{fecha.nombre_fecha_especial}</td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => handleOpenEditModal(fecha)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="icon-delete"
                                                        onClick={() => handleDeleteFechaEspecial(fecha.id_fecha_especial)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No hay fechas especiales disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPagesFechasEspeciales}</span>
                            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesFechasEspeciales))} disabled={currentPage === totalPagesFechasEspeciales}>
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'eventos' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Eventos</h2>
                            <input
                                type="text"
                                id="search-eventos"
                                className="admin-search"
                                placeholder="Buscar evento..."
                                value={searchQuery}
                                onChange={handleSearchChangeEventos}
                            />
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-add-button" onClick={openAddEventoModal}>
                            Agregar Nuevo Evento
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    {['ID', 'Nombre', 'Descripción', 'Foto'].map((col) => (
                                        <th key={col} onClick={() => handleSortEventos(col)} style={{ cursor: 'pointer' }}>
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
                                {paginatedEventos.length > 0 ? (
                                    paginatedEventos.map(evento => (
                                        <tr key={evento.id_evento}>
                                            <td>{evento.id_evento}</td>
                                            <td>{evento.nombre_evento}</td>
                                            <td>{evento.descripcion || 'Sin descripción'}</td> {/* Mostrar descripción o mensaje */}
                                            <td>
                                                {evento.foto_eventoURL ? (
                                                    <img
                                                        src={evento.foto_eventoURL}
                                                        alt={evento.nombre_evento}
                                                        style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <span>Sin imagen</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        title="Editar evento"
                                                        onClick={() => openEditEventoModal(evento)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="icon-delete"
                                                        title="Eliminar evento"
                                                        onClick={() => handleDeleteEvento(evento.id_evento)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-events-message"> {/* Cambiar colSpan a 5 */}
                                            No hay eventos disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPagesEventos}</span>
                            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesEventos))} disabled={currentPage === totalPagesEventos}>
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'pagos' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Pagos</h2>
                            <input
                                type="text"
                                id="search-pagos"
                                className="admin-search"
                                placeholder="Buscar pago por método o número..."
                                value={searchQuery}
                                onChange={handleSearchChangePagos}
                            />
                            <div className='admi'>
                                <select  value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
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
                                    {['ID Pago', 'Documento', 'Fecha', 'Método de Pago', 'Subtotal', 'Total', 'Estado'].map((col) => (
                                        <th key={col} onClick={() => handleSortPagos(col)} style={{ cursor: 'pointer' }}>
                                            {col.charAt(0).toUpperCase() + col.slice(1)}
                                            {sortColumn === col && (
                                                <span className={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}></span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPagos.length > 0 ? (
                                    paginatedPagos.map(pago => (
                                        <tr key={pago.id_pago}>
                                            <td>{pago.id_pago}</td>
                                            <td>{pago.documento}</td>
                                            <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                                            <td>{pago.metodo_pago}</td>
                                            <td>${pago.subtotal_pago.toLocaleString()}</td>
                                            <td>${pago.total_pago.toLocaleString()}</td>
                                            <td>
                                                <select
                                                    value={pago.estado_pago}
                                                    onChange={(e) => handleUpdateEstadoPago(pago.id_pago, e.target.value)}
                                                    className="admin-status-select"
                                                >
                                                    <option value="Exitoso">Exitoso</option>
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Fallido">Fallido</option>
                                                    <option value="Cancelado">Cancelado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No hay pagos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPagesPagos}</span>
                            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPagesPagos))} disabled={currentPage === totalPagesPagos}>
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

{activeSection === 'opciones' && (
    <div className="admin-section">
        <div className="admin-section-header">
            <h2>Opciones <br></br> Adicionales</h2>
            <input
                type="text"
                placeholder="Buscar opción adicional..."
                value={searchQuery}
                onChange={handleSearchChangeOpciones}
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
        <button onClick={() => handleOpenModal()} className="admin-add-button">Agregar Opción</button>
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
                {paginatedOpciones.length > 0 ? (
                    paginatedOpciones.map(opcion => (
                        <tr key={opcion.id_opcion}>
                            <td>{opcion.id_opcion}</td>
                            <td>{opcion.opcion_adicional}</td>
                            <td>${parseFloat(opcion.precio_adicional).toLocaleString()}</td>
                            <td>
                                <div className="admin-actions">
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="icon-edit"
                                        title="Editar opción adicional"
                                        onClick={() => handleOpenModal(opcion)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="icon-delete"
                                        title="Eliminar opción adicional"
                                        onClick={() => deleteOpcionAdicional(opcion.id_opcion)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="no-options-message"> {/* Cambiar colSpan a 4 */}
                            No hay opciones adicionales disponibles
                        </td>
                    </tr>
                )}
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


            </div>
            <Footer />
            {showEditModal && (
                <EditModal
                    usuario={currentUsuario}
                    onClose={closeEditModal}
                    onSave={handleEditUsuario}
                />
            )}
            {modalVisible && (
                <ManageOptionModal
                    onClose={closeModal1}
                    onSave={handleSaveOption}
                    optionData={currentOpcion}
                />
            )}
            {showEditProductModal && (
                <EditProdModal
                    producto={currentProducto}
                    onClose={closeEditProductModal}
                    onSave={handleEditProducto}
                />
            )}
            {showCreateProductModal && (
                <CreateProductModal
                    onClose={closeCreateProductModal}
                    onSave={handleCreateProducto}
                />
            )}
            {isModalOpen && (
                <ManageOrderModal
                    onClose={closeModal}
                    onSave={currentOrder ? handleUpdatePedido : handleCreatePedido}
                    orderData={currentOrder}
                />
            )}
            {fechaEspecialModalOpen && (
                <ManageFechaEspecialModal
                    onClose={closeFechaEspecialModal}
                    onSave={currentFechaEspecial ? handleEditFechaEspecial : handleAddFechaEspecial}
                    fechaEspecialData={currentFechaEspecial}
                />
            )}

            {eventoModalOpen && (
                <ManageEventoModal
                    onClose={closeEventoModal}
                    onSave={currentEvento ? handleEditEvento : handleAddEvento}
                    eventoData={currentEvento}
                />
            )}

            {tipoFlorModalOpen && (
                <ManageTipoFlorModal
                    onClose={closeTipoFlorModal}
                    onSave={currentTipoFlor ? handleEditTipoFlor : handleAddTipoFlor}
                    tipoFlorData={currentTipoFlor}
                />
            )}

            {notification && (
                <div id="notification" className="notification">
                    {notification}
                </div>
            )}

        </div>
    );
};

export default App;