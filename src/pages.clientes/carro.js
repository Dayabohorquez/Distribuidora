import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css'; // Asegúrate de ajustar la ruta a tu archivo CSS

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);
  const [notification, setNotification] = useState('');

  // Función para añadir al carrito
  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setNotification('Producto añadido al carrito de compras.');
    setTimeout(() => setNotification(''), 3000); // Ocultar notificación después de 3 segundos
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  // Mostrar/ocultar carrito
  const hideCart = () => setCartVisible(false);

  // Total del carrito
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <Header/>

      {/* Main content */}
      <main>
        {/* Ejemplo de producto */}
        <div className="product-card">
          <img className="product-img" src="path-to-image.jpg" alt="Producto" />
          <h3>Nombre del Producto</h3>
          <p>$50000</p>
          <button className="btn-cart" onClick={() => addToCart({ img: 'path-to-image.jpg', title: 'Nombre del Producto', price: 50000 })}>
            Añadir al carrito
          </button>
        </div>
        {/* Añade más productos aquí */}
      </main>

      {/* Carrito de Compras */}
      {isCartVisible && (
        <div id="cart" className="cart-content">
          <div className="cart-header">
            <h2>Carrito de Compras</h2>
            <span className="close-cart" onClick={hideCart}>&times;</span>
          </div>
          <div id="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.img} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <p>{item.title}</p>
                  <p>${item.price}</p>
                </div>
                <span className="remove-item" onClick={() => removeFromCart(index)}>&times;</span>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <p id="cart-total">Total: ${cartTotal.toLocaleString()}</p>
            <button id="checkout-button">Comprar</button>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notification && (
        <div id="notification" className="notification">
          {notification}
        </div>
      )}
      
      <Footer/>
    </div>
  );
};

export default App;
