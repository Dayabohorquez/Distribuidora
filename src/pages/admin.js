import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import Headerc from '../components/Header.c';
import Footer from '../components/Footer';
import EditModal from '../components/editmodal';
import EditProdModal from '../components/editprodmodal';
import CreateProductModal from '../components/createprodmodal';
import { faEdit, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ManageOrderModal from '../components/ManageOrderModal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EnvioModal from '../components/enviomodal';
import ManageFechaEspecialModal from '../components/ManageFechaEspecialModal';
import ManageEventoModal from '../components/ManageEventoModal';
import ManageTipoFlorModal from '../components/ManageTipoFlorModal';

const App = () => {
    const [activeSection, setActiveSection] = useState('usuarios');
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [envios, setEnvios] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [currentProducto, setCurrentProduct] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isEnvioModalOpen, setEnvioModalOpen] = useState(false);
    const [currentEnvio, setCurrentEnvio] = useState(null);
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

    useEffect(() => {
        fetchUsuarios();
        fetchProductos();
        fetchPedidos();
        fetchEnvios();
        fetchTiposFlor();
        fetchFechasEspeciales();
        fetchEventos();
    }, []);

    useEffect(() => {
        if (activeSection === 'usuarios') fetchUsuarios();
        if (activeSection === 'productos') fetchProductos();
        if (activeSection === 'pedidos') fetchPedidos();
        if (activeSection === 'envios') fetchEnvios();
        if (activeSection === 'tiposFlor') fetchTiposFlor();
        if (activeSection === 'fechasEspeciales') fetchFechasEspeciales();
        if (activeSection === 'eventos') fetchEventos();
    }, [activeSection]);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            showNotification('Error al obtener los usuarios.');
        }
    };

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

    const handleUpdateRolUsuario = async (documento, nuevoRol) => {
        if (!documento || !nuevoRol) {
            console.error('El documento o el nuevo rol no están definidos');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:4000/api/usuarios/${documento}/rol`, { rol_usuario: nuevoRol });
            if (response.status === 200) {
                fetchUsuarios(); // O la función que recarga la lista de usuarios
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

    const handleToggleStatus = async (documento) => {
        if (!documento) {
            console.error('El documento no está definido');
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas cambiar el estado?')) {
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
        }
    };

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

    const closeEditModal = () => {
        setShowEditModal(false);
        setCurrentUsuario(null);
    };

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

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nombre_usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.apellido_usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuario.documento.toString().includes(searchQuery)
    );

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

        if (window.confirm('¿Estás seguro de que deseas cambiar el estado?')) {
            try {
                const productoActual = productos.find(p => p.id_producto === idProducto);
                const nuevoEstado = !productoActual.estado_producto;

                const response = await axios.patch(`http://localhost:4000/api/productos/${idProducto}/estado`, {
                    estado: nuevoEstado
                });

                if (response.status === 200) {
                    fetchProductos();
                    showNotification('Estado del producto cambiado exitosamente.');
                } else {
                    console.error('Error en la respuesta del servidor:', response.status);
                    showNotification('Error al cambiar el estado del producto.');
                }
            } catch (error) {
                console.error('Error al cambiar el estado del producto:', error);
                showNotification('Error al cambiar el estado del producto.');
            }
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
            cantidad_disponible: parseInt(formData.get('campo_cantidad')),
            id_tipo_flor: parseInt(formData.get('campo_idTipoFlor')),
            id_evento: parseInt(formData.get('campo_idEvento')),
        };

        const fotoFile = formData.get('campo_foto');
        if (fotoFile) {
            formData.append('foto_Producto', fotoFile);
        }

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

    const handleEditProducto = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const updatedProducto = {
            codigo_producto: formData.get('campo_codigo'),
            nombre_producto: formData.get('campo_nombre'),
            descripcion_producto: formData.get('campo_descripcion'),
            precio_producto: parseFloat(formData.get('campo_precio')),
            cantidad_disponible: parseInt(formData.get('campo_cantidad')),
            id_tipo_flor: parseInt(formData.get('campo_idTipoFlor')),
            id_evento: parseInt(formData.get('campo_idEvento')),
        };

        const fotoFile = formData.get('campo_foto');
        if (fotoFile) {
            formData.append('foto_Producto', fotoFile);
        }

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

    const filteredProductos = productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.id_producto.toString().includes(searchQuery) ||
        producto.codigo_producto.toString().includes(searchQuery)
    );

    const fetchPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
            showNotification('Error al obtener los pedidos.');
        }
    };

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

    const handleCreatePedido = async (formData) => {
        const pedidoData = {
            fecha_pedido: formData.get('campo_fecha'),
            total_pagado: parseFloat(formData.get('campo_total')),
            documento: formData.get('campo_documento'),
            pago_id: parseInt(formData.get('campo_pagoId')),
            id_carrito: parseInt(formData.get('campo_carritoId')),
        };

        if (isNaN(pedidoData.total_pagado) || isNaN(pedidoData.pago_id) || isNaN(pedidoData.id_carrito)) {
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

    const handleUpdatePedido = async (formData) => {
        const pedidoData = {
            fecha_pedido: formData.get('campo_fecha'),
            total_pagado: parseFloat(formData.get('campo_total')),
            documento: formData.get('campo_documento'),
            pago_id: parseInt(formData.get('campo_pagoId')),
            id_carrito: parseInt(formData.get('campo_carritoId')),
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
        pedido.fecha_pedido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.id_pedido.toString().includes(searchQuery)
    );

    const fetchEnvios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/envios');
            setEnvios(response.data);
        } catch (error) {
            console.error('Error al obtener los envíos:', error);
            showNotification('Error al obtener los envíos.');
        }
    };

    const handleAddEnvio = async (envioData) => {
        try {
            const response = await axios.post('http://localhost:4000/api/envios', envioData);
            fetchEnvios();
            showNotification('Envío agregado exitosamente.');
        } catch (error) {
            console.error('Error al agregar envío:', error.response ? error.response.data : error.message);
            showNotification('Error al agregar envío.');
        }
    };

    const handleEditEnvio = async (envioData) => {
        if (!currentEnvio || !currentEnvio.id_envio) {
            console.error('No se puede editar el envío, el envío no es válido.');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/envios/${currentEnvio.id_envio}`, envioData);
            fetchEnvios();
            closeEnvioModal();
            showNotification('Envío actualizado exitosamente.');
        } catch (error) {
            console.error('Error al actualizar envío:', error);
            showNotification('Error al actualizar el envío.');
        }
    };

    const handleEstadoChange = async (id_envio, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:4000/api/envios/estado/${id_envio}`, { estado_envio: nuevoEstado });
            fetchEnvios();
            showNotification('Estado del envío actualizado.');
        } catch (error) {
            console.error('Error al actualizar el estado del envío:', error);
            showNotification('Error al actualizar el estado del envío.');
        }
    };

    const handleDeleteEnvio = async (id_envio) => {
        try {
            await axios.delete(`http://localhost:4000/api/envios/${id_envio}`);
            fetchEnvios();
            showNotification('Envío eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar envío:', error);
            showNotification('Error al eliminar el envío.');
        }
    };

    useEffect(() => {
        fetchEnvios(); // Cargar envíos al montar el componente
    }, []);

    const openEnvioModal = () => {
        setCurrentEnvio(null); // Limpia el envío actual para agregar uno nuevo
        setEnvioModalOpen(true); // Abre el modal de envío
    };

    const handleEditEnvioClick = (envio) => {
        setCurrentEnvio(envio);
        setEnvioModalOpen(true); // Abre el modal de envío
    };

    const closeEnvioModal = () => {
        setEnvioModalOpen(false);
        setCurrentEnvio(null); // Limpia el envío actual
    };

    const filteredEnvios = envios.filter(envio =>
        envio.id_envio.toString().includes(searchQuery)
    );

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
        const formData = new FormData();
        formData.append('nombre_tipo_flor', tipoFlorData.get('nombre_tipo_flor'));

        if (tipoFlorData.get('foto_tipo_flor')) {
            formData.append('foto_tipo_flor', tipoFlorData.get('foto_tipo_flor'));
        }

        try {
            const response = await axios.post('http://localhost:4000/api/tipo-flor', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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

        const formData = new FormData();
        formData.append('nombre_tipo_flor', tipoFlorData.get('nombre_tipo_flor'));

        if (tipoFlorData.get('foto_tipo_flor')) {
            formData.append('foto_tipo_flor', tipoFlorData.get('foto_tipo_flor'));
        }

        try {
            await axios.put(`http://localhost:4000/api/tipo-flor/${currentTipoFlor.id_tipo_flor}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
            formData.append('fecha', fechaEspecialData.get('fecha'));
            formData.append('foto', fechaEspecialData.get('foto')); // Puede ser opcional

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

    const filteredFechasEspeciales = fechasEspeciales.filter(fecha =>
        fecha.nombre_fecha_especial.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const filteredEventos = eventos.filter(evento =>
        evento.nombre_evento.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTiposFlor = tiposFlor.filter(tipo =>
        tipo.nombre_tipo_flor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-app">
            <Headerc />
            <div className="admin-container">
                <div className="admin-header">
                    <h1 className="admin-title">¡Bienvenido Administrador!</h1>
                    <p className="admin-description">Utilice el menú de navegación para gestionar los usuarios, productos, pedidos, envíos, tipos de flores, fechas especiales y eventos.</p>
                </div>
                <div className="admin-nav">
                    <button className="admin-nav-button" onClick={() => handleSectionChange('usuarios')}>Usuarios</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('productos')}>Productos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('pedidos')}>Pedidos</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('envios')}>Envios</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('tiposFlor')}>Tipos de Flores</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('fechasEspeciales')}>Fechas Especiales</button>
                    <button className="admin-nav-button" onClick={() => handleSectionChange('eventos')}>Eventos</button>
                </div>

                {activeSection === 'usuarios' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Usuarios</h2>
                            <input
                                type="text"
                                id="search-usuarios"
                                className="admin-search"
                                placeholder="Buscar usuario por nombre o documento..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Dirección</th>
                                    <th>Fecha de Registro</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsuarios.length > 0 ? (
                                    filteredUsuarios.map(usuario => (
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
                                onChange={handleSearchChange}
                            />
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
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Descripción</th>
                                    <th>Foto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProductos.length > 0 ? (
                                    filteredProductos.map(producto => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.id_producto || 'N/A'}</td>
                                            <td>{producto.codigo_producto || 'N/A'}</td>
                                            <td>{producto.nombre_producto || 'N/A'}</td>
                                            <td>{producto.precio_producto ? `${Math.floor(producto.precio_producto)} USD` : 'N/A'}</td>
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
                                onChange={handleSearchChange}
                            />
                        </div>
                        <button className="admin-add-button" onClick={openCreateModal}>Crear Nuevo Pedido</button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Documento Cliente</th>
                                    <th>Nombre Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Foto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredPedidos) && filteredPedidos.length > 0 ? (
                                    filteredPedidos.map(pedido => (
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
                                                {pedido.foto_PedidoURL ? (
                                                    <img
                                                        src={pedido.foto_PedidoURL}
                                                        alt={pedido.nombre_usuario}
                                                        style={{ width: '150px', height: '150px', objectFit: 'contain' }} // Cambia a 'contain'
                                                    />
                                                ) : (
                                                    <span>No disponible</span>
                                                )}
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
                    </div>
                )}

                {activeSection === 'envios' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Envíos</h2>
                            <input
                                type="text"
                                id="search-envios"
                                className="admin-search"
                                placeholder="Buscar envío..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <button className="admin-add-button" onClick={openEnvioModal}>Agregar Nuevo Envío</button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnvios.length > 0 ? (
                                    filteredEnvios.map(envio => (
                                        <tr key={envio.id_envio}>
                                            <td>{envio.id_envio}</td>
                                            <td>{envio.fecha_envio}</td>
                                            <td>
                                                <select
                                                    value={envio.estado_envio}
                                                    onChange={(e) => handleEstadoChange(envio.id_envio, e.target.value)}
                                                >
                                                    <option value="Preparando">Preparando</option>
                                                    <option value="En camino">En camino</option>
                                                    <option value="Entregado">Entregado</option>
                                                    <option value="Retrasado">Retrasado</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-actions">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="icon-edit"
                                                        onClick={() => handleEditEnvioClick(envio)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="icon-delete"
                                                        onClick={() => handleDeleteEnvio(envio.id_envio)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No hay envíos disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'tiposFlor' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Tipos de Flores</h2>
                            <input
                                type="text"
                                id="search-tipos-flor"
                                className="admin-search"
                                placeholder="Buscar tipo de flor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="admin-add-button" onClick={openAddTipoFlorModal}>
                            Agregar Nuevo Tipo de Flor
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Foto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTiposFlor.length > 0 ? (
                                    filteredTiposFlor.map(tipoFlor => (
                                        <tr key={tipoFlor.id_tipo_flor}>
                                            <td>{tipoFlor.id_tipo_flor}</td>
                                            <td>{tipoFlor.nombre_tipo_flor}</td>
                                            <td>
                                                {tipoFlor.foto_tipo_florURL ? (
                                                    <img
                                                        src={tipoFlor.foto_tipo_florURL}
                                                        alt={tipoFlor.nombre_tipo_flor}
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
                    </div>
                )}


                {activeSection === 'fechasEspeciales' && (
                    <div className="admin-section">
                        <div className="admin-section-header">
                            <h2>Fechas Especiales</h2>
                            <input
                                type="text"
                                id="search-fechas-especiales"
                                className="admin-search"
                                placeholder="Buscar fecha especial..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="admin-add-button" onClick={openFechaEspecialModal}>
                            Agregar Nueva Fecha Especial
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Foto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFechasEspeciales.length > 0 ? (
                                    filteredFechasEspeciales.map(fecha => (
                                        <tr key={fecha.id_fecha_especial}>
                                            <td>{fecha.id_fecha_especial}</td>
                                            <td>{fecha.nombre_fecha_especial}</td>
                                            <td>{fecha.fecha}</td>
                                            <td>
                                                {fecha.foto_fecha_especialURL ? (
                                                    <img
                                                        src={fecha.foto_fecha_especialURL}
                                                        alt={fecha.nombre_fecha_especial}
                                                        style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <span>No disponible</span>
                                                )}
                                            </td>
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="admin-add-button" onClick={openAddEventoModal}>
                            Agregar Nuevo Evento
                        </button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th> {/* Nueva columna para la descripción */}
                                    <th>Foto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEventos.length > 0 ? (
                                    filteredEventos.map(evento => (
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
            {isEnvioModalOpen && (
                <EnvioModal
                    currentEnvio={currentEnvio}
                    isOpen={isEnvioModalOpen}
                    onClose={closeEnvioModal}
                    onSave={currentEnvio ? handleEditEnvio : handleAddEnvio}
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