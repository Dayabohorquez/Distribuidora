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

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(!!decoded.rol);
            } catch (e) {
                console.error('Error decodificando el token', e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const documento = localStorage.getItem('documento');
            if (!documento) {
                setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/carritos/${documento}`);
                setCartItems(Array.isArray(response.data) ? response.data : Object.values(response.data));
            } catch (error) {
                console.error('Error al obtener el carrito:', error);
                setNotification('Error al obtener el carrito. Intenta de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const updateQuantity = useCallback(async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.put(`http://localhost:4000/api/carritos/${itemId}`, { cantidad: newQuantity });
            setCartItems(prevItems => prevItems.map(item =>
                item.id_carrito === itemId ? { ...item, cantidad: newQuantity } : item
            ));
            setNotification('Cantidad actualizada.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            setNotification('Error al actualizar la cantidad.');
        }
    }, []);

    const removeFromCart = useCallback(async (itemId) => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.delete(`http://localhost:4000/api/carritos/${itemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id_carrito !== itemId));
            setNotification('Producto eliminado del carrito.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setNotification('Error al eliminar el producto.');
        }
    }, []);

    const emptyCart = useCallback(async () => {
        const documento = localStorage.getItem('documento');
        if (!documento) {
            setNotification('No se ha encontrado el documento. Por favor, inicie sesión nuevamente.');
            return;
        }
        try {
            await axios.delete(`http://localhost:4000/api/carritos/vaciar/${documento}`);
            setCartItems([]);
            setNotification('Carrito vacío.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            setNotification('Error al vaciar el carrito.');
        }
    }, []);

    const calcularPrecioAdicional = (opcion) => {
        switch (opcion) {
            case 'Chocolates':
                return 30000;
            case 'Vino':
                return 86000;
            default:
                return 0;
        }
    };

    const cartTotal = cartItems.reduce((total, item) => {
        const precioAdicional = calcularPrecioAdicional(item.opcion_adicional);
        return total + ((parseFloat(item.precio_producto) + precioAdicional) * item.cantidad || 0);
    }, 0);

    const ivaRate = 0.19; // 19%
    const ivaTotal = cartTotal * ivaRate;
    const totalConIva = cartTotal + ivaTotal;

    const handleCheckout = () => {
        const cartData = cartItems.map(({ id_carrito, nombre_producto, precio_producto, cantidad, opcion_adicional }) => ({
            id_carrito,
            nombre_producto,
            precio_producto,
            cantidad,
            opcion_adicional,
        }));

        navigate('/payment-method', { state: { cartItems: cartData, subtotal: cartTotal } });
    };

    return (
        <div className="admin-app">
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="cart-page">
                <h2 className="cart-title">Carrito de Compras</h2>
                {notification && <div className="notification">{notification}</div>}
                {loading ? (
                    <div className="loading">Cargando...</div>
                ) : cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p className="empty-cart-message">El carrito está vacío.</p>
                    </div>
                ) : (
                    <div className="cart-content">
                        {cartItems.map(item => {
                            const precioAdicional = calcularPrecioAdicional(item.opcion_adicional);
                            const total = (parseFloat(item.precio_producto) + precioAdicional) * item.cantidad;

                            return (
                                <div key={item.id_carrito} className="cart-item">
                                    <img
                                        src={item.foto_ProductoURL || 'path/to/default/image.jpg'}
                                        alt={item.nombre_producto}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.nombre_producto}</h3>
                                        <p className="cart-item-price">Precio base: ${parseFloat(item.precio_producto).toLocaleString()}</p>
                                        <p className="cart-item-adicional">Precio adicional: ${precioAdicional.toLocaleString()}</p>
                                        <p className="cart-item-total">Total: ${total.toLocaleString()}</p>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value >= 1) {
                                                    updateQuantity(item.id_carrito, value);
                                                }
                                            }}
                                            className="quantity-input"
                                        />
                                        <button className="remove-button" onClick={() => removeFromCart(item.id_carrito)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="cart-footer">
                            <p className="cart-total">Subtotal: ${cartTotal.toLocaleString()}</p>
                            <p className="cart-iva">IVA (19%): ${ivaTotal.toLocaleString()}</p>
                            <p className="cart-total-con-iva">Total con IVA: ${totalConIva.toLocaleString()}</p>
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
