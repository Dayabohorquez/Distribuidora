import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaTrash } from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            const documento = localStorage.getItem('documento');
            if (!documento) {
                console.error('Documento no encontrado.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/api/carritos/${documento}`);
                const items = Array.isArray(response.data) ? response.data : Object.values(response.data);
                setCartItems(items);
            } catch (error) {
                console.error('Error al obtener el carrito:', error);
                setNotification('Error al obtener el carrito.');
            }
        };

        fetchCart();
    }, []);

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

    const updateQuantity = useCallback(async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:4000/api/carritos/${itemId}`, { cantidad: newQuantity });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id_carrito === itemId ? { ...item, cantidad: newQuantity } : item
                )
            );
            setNotification('Cantidad actualizada.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            setNotification('Error al actualizar la cantidad.');
        }
    }, []);

    const removeFromCart = useCallback(async (itemId) => {
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
            console.error('Documento no encontrado para vaciar el carrito.');
            return;
        }
        try {
            await axios.delete(`http://localhost:4000/api/carritos/usuario/${documento}`);
            setCartItems([]);
            setNotification('Carrito vacío.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            setNotification('Error al vaciar el carrito.');
        }
    }, []);

    const cartTotal = cartItems.reduce((total, item) => total + (item.precio_producto * item.cantidad), 0);

    const handleCheckout = () => {
        const cartData = cartItems.map(({ id_carrito, nombre_producto, precio_producto, cantidad }) => ({
            id_carrito,
            nombre_producto,
            precio_producto,
            cantidad,
        }));

        navigate('/payment-method', { state: { cartItems: cartData, subtotal: cartTotal } });
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
                        {cartItems.map(item => (
                            <div key={item.id_carrito} className="cart-item">
                                <img
                                    src={item.foto_ProductoURL || 'path/to/default/image.jpg'}
                                    alt={item.nombre_producto}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.nombre_producto}</h3>
                                    <p className="cart-item-price">${item.precio_producto.toLocaleString()}</p>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => updateQuantity(item.id_carrito, parseInt(e.target.value) || 1)}
                                        className="quantity-input"
                                    />
                                    <button className="remove-button" onClick={() => removeFromCart(item.id_carrito)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-footer">
                            <p className="cart-total">Total: ${cartTotal.toLocaleString()}</p>
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
