import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Interceptor para agregar el token
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Define the function here
const groupCartItems = (items) => {
    return items.reduce((acc, item) => {
        const key = `${item.nombre_producto}-${item.opcion_adicional}-${item.dedicatoria}`;
        if (!acc[key]) {
            acc[key] = { ...item, cantidad: 0 };
        }
        acc[key].cantidad += item.cantidad;
        return acc;
    }, {});
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [cartTotal, setCartTotal] = useState({ subtotal: 0, iva: 0 });

    const additionalOptionPrices = {
        'Ninguno': 0,
        'Chocolates': 30000,
        'Vino': 86000,
    };

    const ivaRate = 0.19;

    // Verificar autenticación del usuario
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(!!decoded.rol);
            } catch (e) {
                console.error('Error decodificando el token', e);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Cargar elementos del carrito
    useEffect(() => {
        const fetchCart = async () => {
            const documento = localStorage.getItem('documento');
            if (!documento) {
                setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/api/carrito/completo/${documento}`);
                localStorage.setItem('id_carrito', response.data.id_carrito);
                setCartItems(response.data.map(item => ({
                    ...item,
                    id_producto: item.id_producto || item.id_carrito_item, // Asignar id_producto
                })));
                updateCartTotal(response.data);
            } catch (error) {
                console.error('Error al cargar el carrito:', error);
            }
        };

        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    // Calcular totales
    const updateCartTotal = (items) => {
        const total = items.reduce((acc, item) => {
            const precioBase = parseFloat(item.precio_producto) || 0;
            const precioAdicional = parseFloat(item.precio_adicional) || 0;
            const cantidad = parseInt(item.cantidad) || 0;
            return acc + ((precioBase + precioAdicional) * cantidad);
        }, 0);
        setCartTotal({ subtotal: total, iva: total * ivaRate });
    };

    // Actualizar el total en la base de datos
    const updateTotalInDatabase = useCallback(async () => {
        const id_carrito = localStorage.getItem('id_carrito');
        if (!id_carrito) {
            setNotification('ID de carrito no encontrado.');
            return;
        }

        const totalConIva = cartTotal.subtotal + cartTotal.iva;
        try {
            await axios.put(`http://localhost:4000/api/actualizarTotal/${id_carrito}`, { total: totalConIva });
        } catch (error) {
            setNotification('Error al actualizar el total.');
        }
    }, [cartTotal]);

    // Actualizar cantidad del producto en el carrito
    const updateQuantity = useCallback(async (itemId, newQuantity, availableStock) => {
        if (newQuantity < 1 || newQuantity > availableStock) {
            setNotification(`Los productos se han agotado`);
            return;
        }
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.put(`http://localhost:4000/api/carrito/actualizar/${itemId}`, { cantidad: newQuantity });
            setCartItems(prevItems => {
                const updatedItems = prevItems.map(item =>
                    item.id_carrito_item === itemId ? { ...item, cantidad: newQuantity } : item
                );
                updateCartTotal(updatedItems);
                updateTotalInDatabase();
                return updatedItems;
            });
            setNotification('Cantidad actualizada.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            setNotification('Error al actualizar la cantidad.');
        }
    }, [updateTotalInDatabase]);

    // Actualizar opción adicional y dedicatoria
    const updateAdditionalOptions = useCallback(async (itemId, newOption, newDedicatoria) => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }

        const newPrice = additionalOptionPrices[newOption] || 0;

        try {
            await axios.put(`http://localhost:4000/api/carritos/actualizar/${itemId}`, {
                opcion_adicional: newOption,
                dedicatoria: newDedicatoria
            });

            setCartItems(prevItems => {
                const updatedItems = prevItems.map(item =>
                    item.id_carrito_item === itemId ? {
                        ...item,
                        opcion_adicional: newOption,
                        dedicatoria: newDedicatoria,
                        precio_adicional: newPrice,
                        id_producto: item.id_producto // Asegúrate de mantener el id_producto
                    } : item
                );
                updateCartTotal(updatedItems);
                updateTotalInDatabase();
                return updatedItems;
            });

        } catch (error) {
            console.error('Error al actualizar la opción adicional o dedicatoria:', error);
            setNotification('Error al actualizar.');
        }
    }, [additionalOptionPrices, updateTotalInDatabase]);

    // Eliminar producto del carrito
    const removeFromCart = useCallback(async (itemId) => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.delete(`http://localhost:4000/api/carrito/eliminar/${itemId}`);
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.id_carrito_item !== itemId);
                updateCartTotal(updatedItems);
                updateTotalInDatabase();
                return updatedItems;
            });
            setNotification('Producto eliminado del carrito.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setNotification('Error al eliminar el producto.');
        }
    }, [updateTotalInDatabase]);

    // Vaciar carrito completo
    const emptyCart = useCallback(async () => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.delete(`http://localhost:4000/api/carrito/vaciar/${documento}`);
            setCartItems([]);
            setCartTotal({ subtotal: 0, iva: 0 });
            updateTotalInDatabase();
            setNotification('Carrito vacío.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            setNotification('Error al vaciar el carrito.');
        }
    }, [updateTotalInDatabase]);

    // Opciones adicionales para el desplegable
    const additionalOptions = Object.keys(additionalOptionPrices);

    const handleCheckout = () => {
        updateTotalInDatabase();
    
        const cartData = cartItems.map(({ id_producto, nombre_producto, precio_producto, cantidad, opcion_adicional, dedicatoria, precio_adicional }) => ({
            id_producto,
            nombre_producto,
            precio_producto,
            cantidad,
            opcion_adicional,
            dedicatoria,
            precio_adicional: precio_adicional || 0,
        }));
    
        const id_carrito = localStorage.getItem('id_carrito');
    
        // Verificar que el ID del carrito esté presente
        console.log('ID del carrito antes de navegar:', id_carrito);
    
        if (!id_carrito) {
            console.error('El ID del carrito no está definido. Asegúrate de que se almacene correctamente en localStorage.');
            return; // Detener la ejecución si no hay ID
        }
    
        navigate('/payment-method', {
            state: {
                cartItems: cartData,
                subtotal: cartTotal.subtotal || 0,
                id_carrito: id_carrito,
            },
        });
    };    
    
    return (
        <div className="admin-app">
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="cart-page">
                <h2 className="cart-title">Carrito de Compras</h2>
                {notification && <div className="notification">{notification}</div>}
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p className="empty-cart-message">El carrito está vacío.</p>
                    </div>
                ) : (
                    <div className="cart-content">
                        {Object.values(groupCartItems(cartItems)).map(item => {
                            const precioAdicional = parseFloat(item.precio_adicional) || 0;
                            const precioBase = parseFloat(item.precio_producto) || 0;
                            const total = (precioBase + precioAdicional) * item.cantidad;

                            return (
                                <div key={item.id_carrito_item} className="cart-item">
                                    {item.foto_ProductoURL ? (
                                        <img
                                            src={item.foto_ProductoURL}
                                            alt={item.nombre_producto}
                                            className="cart-item-image"
                                        />
                                    ) : (
                                        <div className="no-image">Imagen no disponible</div>
                                    )}
                                    <h3 className="cart-item-name">{item.nombre_producto}</h3>
                                    <p className="cart-item-price">Precio base: ${precioBase.toLocaleString()}</p>

                                    {item.opcion_adicional && item.opcion_adicional !== 'Ninguno' && (
                                        <p className="cart-item-adicional">
                                            Precio adicional: ${precioAdicional.toLocaleString()} ({item.opcion_adicional})
                                        </p>
                                    )}

                                    {item.dedicatoria && (
                                        <p className="cart-item-dedicatoria">Dedicatoria: {item.dedicatoria}</p>
                                    )}

                                    <p className="cart-item-total">Total: ${total.toLocaleString()}</p>

                                    <input
                                        type="number"
                                        min="1"
                                        max={item.cantidad_disponible} // Límite superior
                                        value={item.cantidad}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= item.cantidad_disponible) {
                                                updateQuantity(item.id_carrito_item, value, item.cantidad_disponible);
                                            } else {
                                                setNotification(`La cantidad debe estar entre 1 y ${item.cantidad_disponible}.`);
                                            }
                                        }}
                                        className="quantity-input"
                                    />

                                    <select
                                        value={item.opcion_adicional}
                                        onChange={(e) => updateAdditionalOptions(item.id_carrito_item, e.target.value, item.dedicatoria)}
                                        className="additional-option-select"
                                    >
                                        {additionalOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>

                                    {item.opcion_adicional !== 'Ninguno' && (
                                        <input
                                            type="text"
                                            value={item.dedicatoria}
                                            onChange={(e) => updateAdditionalOptions(item.id_carrito_item, item.opcion_adicional, e.target.value)}
                                            className="dedicatoria-input"
                                            placeholder="Dedicatoria"
                                        />
                                    )}

                                    <button className="remove-button" onClick={() => removeFromCart(item.id_carrito_item)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            );
                        })}
                        <div className="cart-footer">
                            <p className="cart-total">Subtotal: ${cartTotal.subtotal.toLocaleString()}</p>
                            <p className="cart-iva">IVA (19%): ${cartTotal.iva.toLocaleString()}</p>
                            <p className="cart-total-con-iva">Total con IVA: ${(cartTotal.subtotal + cartTotal.iva).toLocaleString()}</p>
                            <div className="cart-actions">
                                <button className="empty-cart-button" onClick={emptyCart}>Vaciar Carrito</button>
                                <button className="checkout-button" onClick={handleCheckout}>Comprar</button>
                            </div>
                        </div>
                    </div>
                )}
                <a
                    href="https://wa.me/3222118028"
                    className="whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaWhatsapp size={30} />
                </a>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;