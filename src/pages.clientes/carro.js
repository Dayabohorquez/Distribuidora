  import React, { useState, useEffect } from 'react';
  import Footer from '../components/Footer';
  import Header from '../components/Header';
  import Headerc from '../components/Header.c';
  import '../index.css';
  import { FaWhatsapp } from 'react-icons/fa';
  import { jwtDecode } from 'jwt-decode';
  import { useNavigate } from 'react-router-dom';

  /* Importar imágenes */
  import Cumpleaños1 from '../static/img/Cumpleaños1.jpeg';
  import Cumpleaños2 from '../static/img/Cumpleaños2.jpeg';
  import Cumpleaños3 from '../static/img/Cumpleaños3.jpeg';

  const App = () => {
    const [products] = useState([
      { id: 'product1', title: 'Nombre del Producto 1', price: 50000, img: Cumpleaños1 },
      { id: 'product2', title: 'Nombre del Producto 2', price: 60000, img: Cumpleaños2 },
      { id: 'product3', title: 'Nombre del Producto 3', price: 70000, img: Cumpleaños3 },
    ]);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setCartVisible] = useState(false);
    const [notification, setNotification] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    const addToCart = (item) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prevCart, { ...item, quantity: 1 }];
      });
      setNotification('Producto añadido al carrito de compras.');
      setTimeout(() => setNotification(''), 3000);
    };

    const removeFromCart = (index) => {
      setCart(prevCart => prevCart.filter((_, i) => i !== index));
      setNotification('Producto eliminado del carrito.');
      setTimeout(() => setNotification(''), 3000);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity || 0), 0);
    

    return (
      <div>
        {isAuthenticated ? <Headerc /> : <Header />}
        <div className="cart-icon" onClick={() => setCartVisible(!isCartVisible)}>
          🛒 {cart.length > 0 && <span>({cart.length})</span>}
        </div>

        {isCartVisible && (
          <div id="cart" className="cart-content" style={{ display: 'block' }}>
            <div className="cart-footer">
              <p id="cart-total">Total: ${cartTotal.toLocaleString()}</p>
              <button id="checkout-button">Comprar</button>
            </div>
          </div>
        )}

        {notification && (
          <div id="notification" className="notification">
            {notification}
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

  export default App;
