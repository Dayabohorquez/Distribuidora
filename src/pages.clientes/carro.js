import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [additionalOptions, setAdditionalOptions] = useState([]);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [cartTotal, setCartTotal] = useState({ subtotal: 0, iva: 0 });
    const ivaRate = 0.19;

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

    useEffect(() => {
        const fetchAdditionalOptions = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/opciones-adicionales');
                setAdditionalOptions(response.data);
            } catch (error) {
                console.error('Error al obtener las opciones adicionales:', error);
            }
        };
        fetchAdditionalOptions();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const documento = localStorage.getItem('documento');
            if (!documento) {
                setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/api/carrito/completo/${documento}`);
                setCartItems(response.data);
                updateCartTotal(response.data);
            } catch (error) {
                setNotification('Carrito Vacio.');
            }
        };

        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const updateCartTotal = (items) => {
        const total = items.reduce((acc, item) => {
            const precioBase = parseFloat(item.precio_producto) || 0;
            const precioAdicional = parseFloat(item.precio_adicional) || 0;
            const cantidad = parseInt(item.cantidad) || 0;
            return acc + ((precioBase + precioAdicional) * cantidad);
        }, 0);
        setCartTotal({ subtotal: total, iva: total * ivaRate });
    };

    const handleQuantityChange = async (id, newQuantity, availableStock) => {
        if (newQuantity < 1 || newQuantity > availableStock) {
            setNotification(`La cantidad debe estar entre 1 y ${availableStock}.`);
            return;
        }

        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/carrito/actualizarc/${id}`, { cantidad: newQuantity });
            setCartItems(prevItems => {
                const updatedItems = prevItems.map(item =>
                    item.id_carrito_item === id ? { ...item, cantidad: newQuantity } : item
                );
                updateCartTotal(updatedItems);
                return updatedItems;
            });
            setNotification('Cantidad actualizada.');
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            setNotification('Error al actualizar la cantidad.');
        }
    };

    const handleOptionChange = async (itemId, newOption, newDedicatoria) => {
        const selectedOption = additionalOptions.find(option => option.opcion_adicional === newOption);
        const newPrice = selectedOption ? selectedOption.precio_adicional : 0;

        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            await axios.put(`http://localhost:4000/api/carritos/actualizar/${itemId}`, {
                opcion_adicional: selectedOption ? selectedOption.id_opcion : null,
                dedicatoria: newDedicatoria,
            });

            setCartItems(prevItems => {
                const updatedItems = prevItems.map(item =>
                    item.id_carrito_item === itemId ? {
                        ...item,
                        opcion_adicional: newOption,
                        dedicatoria: newDedicatoria,
                        precio_adicional: newPrice,
                    } : item
                );
                updateCartTotal(updatedItems);
                return updatedItems;
            });

            setNotification('Opción adicional y dedicatoria actualizadas.');
        } catch (error) {
            console.error('Error al actualizar:', error);
            setNotification('Error al actualizar.');
        }
    };

    const removeFromCart = async (itemId) => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/api/carrito/eliminar/${itemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id_carrito_item !== itemId));
            updateCartTotal(cartItems);
            setNotification('Producto eliminado del carrito.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setNotification('Error al eliminar el producto.');
        }
    };

    const emptyCart = async () => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/api/carrito/vaciar/${documento}`);
            setCartItems([]);
            setCartTotal({ subtotal: 0, iva: 0 });
            setNotification('Carrito vacío.');
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            setNotification('Error al vaciar el carrito.');
        }
    };

    const handleCheckout = () => {
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

        if (!id_carrito) {
            console.error('El ID del carrito no está definido.');
            return;
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
                        {cartItems.map(item => {
                            const precioBase = parseFloat(item.precio_producto) || 0;
                            const precioAdicional = parseFloat(item.precio_adicional) || 0;
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

                                    {item.opcion_adicional && (
                                        <p className="cart-item-adicional">Opción adicional: {item.opcion_adicional} (+${precioAdicional.toLocaleString()})</p>
                                    )}

                                    {item.dedicatoria && (
                                        <p className="cart-item-dedicatoria">Dedicatoria: {item.dedicatoria}</p>
                                    )}

                                    <p className="cart-item-total">Total: ${total.toLocaleString()}</p>

                                    <input
                                        type="number"
                                        min="1"
                                        max={item.cantidad_disponible}
                                        value={item.cantidad}
                                        onChange={(e) => handleQuantityChange(item.id_carrito_item, parseInt(e.target.value), item.cantidad_disponible)}
                                        className="quantity-input"
                                    />

                                    <select
                                        value={item.opcion_adicional || 'ninguno'}
                                        onChange={(e) => handleOptionChange(item.id_carrito_item, e.target.value, item.dedicatoria)}
                                    >
                                        <option value="ninguno">Ninguno</option>
                                        {additionalOptions.map(option => (
                                            <option key={option.id} value={option.opcion_adicional}>
                                                {option.opcion_adicional} (+${option.precio_adicional.toLocaleString()})
                                            </option>
                                        ))}
                                    </select>

                                    {item.opcion_adicional !== 'Ninguno' && (
                                        <input
                                            type="text"
                                            value={item.dedicatoria || ''}
                                            onChange={(e) => handleOptionChange(item.id_carrito_item, item.opcion_adicional, e.target.value)}
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
