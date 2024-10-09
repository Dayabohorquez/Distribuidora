import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CartPage = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            const documento = localStorage.getItem('documento');
            if (!documento) {
                console.error('Documento no encontrado.');
                return; 
            }
            try {
                const response = await axios.get(`http://localhost:4000/api/carritos/${documento}`);
                console.log('Carrito obtenido:', response.data);
                setCartItems(response.data); // Actualiza el estado con los items del carrito
            } catch (error) {
                console.error('Error al obtener el carrito:', error);
            }
        };
        fetchCart();
    }, [userId]);

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

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            await axios.put(`http://localhost:4000/api/carritos/${itemId}`, { cantidad: newQuantity });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id_carrito === itemId ? { ...item, cantidad: newQuantity } : item // Asegúrate de usar el campo correcto
                )
            );
            setNotification('Cantidad actualizada.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            setNotification('Error al actualizar la cantidad.');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`http://localhost:4000/api/carritos/${itemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id_carrito !== itemId)); // Asegúrate de usar el campo correcto
            setNotification('Producto eliminado del carrito.');
            setTimeout(() => setNotification(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setNotification('Error al eliminar el producto.');
        }
    };

    const emptyCart = async () => {
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
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.precio_producto * item.cantidad), 0); // Asegúrate de usar el campo correcto

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <h2>Carrito de Compras</h2>
            {notification && <div className="notification">{notification}</div>}
            {cartItems.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <div className="cart-content">
                    {cartItems.map(item => (
                        <div key={item.id_carrito} className="cart-item"> {/* Asegúrate de usar el campo correcto */}
                            <img src={item.foto_ProductoURL} alt={item.nombre_producto} />
                            <p>{item.nombre_producto} - ${item.precio_producto.toLocaleString()} (x{item.cantidad})</p>
                            <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) => updateQuantity(item.id_carrito, parseInt(e.target.value))} // Asegúrate de usar el campo correcto
                            />
                            <button onClick={() => removeFromCart(item.id_carrito)}>Eliminar</button> {/* Asegúrate de usar el campo correcto */}
                        </div>
                    ))}
                    <div className="cart-footer">
                        <p>Total: ${cartTotal.toLocaleString()}</p>
                        <button onClick={emptyCart}>Vaciar Carrito</button>
                        <button id="checkout-button">Comprar</button>
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
            <Footer />
        </div>
    );
};

export default CartPage;
