import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css'; // Asegúrate de ajustar la ruta a tu archivo CSS

/*Importar imagenes*/
import Ramo1 from '../static/img/Ramo1.jpeg';

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);
  const [notification, setNotification] = useState('');
  const [opcionAdicionalPrecio, setOpcionAdicionalPrecio] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('ninguno');
  
  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setNotification('Producto añadido al carrito de compras.');
    setTimeout(() => setNotification(''), 3000);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const hideCart = () => setCartVisible(false);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  const updateProductPrice = () => {
    const basePrice = 350000; // Precio base del producto
    const totalPrice = (basePrice + opcionAdicionalPrecio) * quantity;
    return totalPrice;
  };

  const handleOptionChange = (event) => {
    const option = event.target.value;
    switch (option) {
      case 'chocolate':
        setOpcionAdicionalPrecio(30000);
        break;
      case 'vino':
        setOpcionAdicionalPrecio(86000);
        break;
      default:
        setOpcionAdicionalPrecio(0);
    }
    setSelectedOption(option);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <Header/>

      <div className="contenedor-detalle">
        <aside className="sidebar">
          <h2>
            <a href="/DiaMujer" className="home-link">
              <FontAwesomeIcon icon={faArrowLeft} />
            </a> / Personalización
          </h2>
          <div className="filter">
            <h3>Novedades</h3>
            <ul>
              <li>
                <a href="detalle_producto.html" className="filter1">
                  <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                  Arreglo floral Lirios de Amor - $350,000
                </a>
                <a href="detalle_producto.html" className="filter1">
                  <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                  Arreglo floral Lirios de Amor - $350,000
                </a>
                <a href="detalle_producto.html" className="filter1">
                  <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                  Arreglo floral Lirios de Amor - $350,000
                </a>
              </li>
              {/* Añadir más elementos aquí */}
            </ul>
          </div>
        </aside>

        <section className="detalle-producto">
          <h2 className="descripcion">Descripción del Producto</h2>

          <div className="contenido-producto">
            <div className="imagen-producto">
              <img src={Ramo1} alt="Arreglo floral Lirios de Amor" />
            </div>
            <div className="info-producto">
              <h3>Arreglo floral Lirios de Amor</h3>
              <p>Hermoso arreglo en rosas fucsias y lirios, con follaje en rusco y gypsophila (redondo).</p>

              <div className="meta-producto">
                <p><strong>$350,000</strong></p>
              </div>

              <div className="opciones-producto">
                <h4 className="opciones">Opciones disponibles</h4>
                <label className="detalle-adicional" htmlFor="detalle-adicional">Detalle adicional</label>
                <select id="detalle-adicional" value={selectedOption} onChange={handleOptionChange}>
                  <option value="ninguno">Ninguno</option>
                  <option value="chocolate">Chocolate Ferrero Rocher (caja x 8Und) (+$30,000)</option>
                  <option value="vino">Vino (+$86,000)</option>
                </select>

                <label className="fecha-entrega" htmlFor="fecha-entrega">Fecha de Entrega</label>
                <input type="date" id="fecha-entrega" required />

                <label className="dedicatoria" htmlFor="dedicatoria">Dirección</label>
                <textarea id="dedicatoria" placeholder="Escribe tu mensaje aquí" required></textarea>

                <label className="dedicatoria" htmlFor="dedicatoria">Dedicatoria</label>
                <textarea id="dedicatoria" placeholder="Escribe tu mensaje aquí"></textarea>

                <label className="cantidad" htmlFor="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" value={quantity} min="1" onChange={handleQuantityChange} required />
              </div>
              <div className="botones">
                <button className="btn-comprar-producto" onClick={() => addToCart({
                  img: 'assets/img/Ramo1.jpeg',
                  title: 'Arreglo floral Lirios de Amor',
                  price: updateProductPrice()
                })}>Comprar</button>
                <button className="btn-comprar-producto" onClick={() => addToCart({
                  img: 'assets/img/Ramo1.jpeg',
                  title: 'Arreglo floral Lirios de Amor',
                  price: updateProductPrice()
                })}>Añadir al carrito</button>
              </div>
            </div>
          </div>
        </section>

        {/* Carrito de compras */}
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
                    <p>${item.price.toLocaleString()}</p>
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

        {/* Contenedor para la notificación */}
        {notification && (
          <div id="notification" className="notification">
            {notification}
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
};

export default App;
