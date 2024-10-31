import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { id_carrito, subtotal: initialSubtotal, cartItems: initialCartItems = [] } = location.state || {};

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(initialSubtotal || 0);
  const [shippingAddress, setShippingAddress] = useState('');

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

    if (!id_carrito) {
      console.error('ID del carrito no está definido.');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/carrito-item/${id_carrito}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCartItems(response.data);
          const totalSubtotal = response.data.reduce((acc, item) => {
            const itemTotal = (parseFloat(item.precio_producto) + (parseFloat(item.precio_adicional) || 0)) * item.cantidad;
            return acc + itemTotal;
          }, 0);
          setSubtotal(totalSubtotal);
        } else {
          setNotification({ message: 'No hay productos en el carrito.', type: 'info' });
        }
      } catch (error) {
        console.error('Error al obtener los items del carrito:', error);
        setNotification({ message: 'Error al cargar los items del carrito', type: 'error' });
      }
    };

    if (id_carrito && cartItems.length === 0) {
      fetchCartItems();
    }
  }, [id_carrito, cartItems]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value !== 'efectivo') {
      document.getElementById('efectivo-number').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      setNotification({ message: 'El carrito está vacío.', type: 'error' });
      return;
    }

    const unavailableItems = cartItems.filter(item => item.cantidad > item.cantidad_disponible);
    if (unavailableItems.length > 0) {
      setNotification({ message: 'Algunos productos en el carrito están agotados. Actualiza el carrito.', type: 'error' });
      return;
    }

    const documento = localStorage.getItem('documento');
    if (!documento) {
      setNotification({ message: 'Documento no encontrado. Inicie sesión nuevamente.', type: 'error' });
      return;
    }

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const validItems = cartItems.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(item.precio_producto),
      dedicatoria: item.dedicatoria || '',
      opcion_adicional: item.opcion_adicional && item.opcion_adicional !== 'Ninguna' ? item.opcion_adicional : null,
    }));

    const paymentAndOrderData = {
      documento: parseInt(documento),
      metodo_pago: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
      subtotal_pago: parseFloat(subtotal.toFixed(2)),
      total_pago: parseFloat(total.toFixed(2)),
      items: validItems,
      direccion_envio: shippingAddress,
    };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/pago-y-pedido', paymentAndOrderData);

      if (response.data.mensaje === "Pedido realizado con éxito") {
        await axios.delete(`http://localhost:4000/api/carrito/vaciar/${documento}`);
        setNotification({ message: 'Pago realizado y pedido creado exitosamente!', type: 'success' });
        navigate('/');
      } else {
        throw new Error("Error al crear el pago y el pedido");
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setNotification({
        message: error.response?.data.mensaje || 'Error al procesar el pago. Inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const key = `${item.id_producto}-${item.opcion_adicional || 'Ninguno'}`;
    if (!acc[key]) {
      acc[key] = { ...item, cantidad: 0, precio_adicional: 0 };
    }
    acc[key].cantidad += item.cantidad;

    if (item.precio_adicional) {
      acc[key].precio_adicional += parseFloat(item.precio_adicional) * item.cantidad;
    }

    return acc;
  }, {});

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <>
      {isAuthenticated ? <Headerc /> : <Header />}
      <main className="payment-method-container">
        <h1>Método de Pago</h1>
        {notification.message && <div className={notification.type}>{notification.message}</div>}
        {loading && <div className="loading">Procesando...</div>}
        <section className="section payment-method">
          <h2>Selecciona tu Método de Pago</h2>
          <form onSubmit={handleSubmit}>
            {['nequi', 'bancolombia', 'efectivo'].map(method => (
              <div className="payment-option" key={method}>
                <input
                  type="radio"
                  id={method}
                  name="payment-method"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</label>
              </div>
            ))}
            <div className="payment-details">
              <h3>Detalles del Pago</h3>
              {['nequi', 'bancolombia', 'efectivo'].map(method => (
                <div
                  id={`${method}-details`}
                  className="payment-details-content"
                  style={{ display: paymentMethod === method ? 'block' : 'none' }}
                  key={method}
                >
                  <label htmlFor={`${method}-number`}>
                    {method === 'efectivo' ? 'Monto en Efectivo' : `Número de ${method.charAt(0).toUpperCase() + method.slice(1)}:`}
                  </label>
                  <input
                    type="text"
                    id={`${method}-number`}
                    name={`${method}-number`}
                    required={paymentMethod === method}
                  />
                </div>
              ))}
            </div>

            <div className="shipping-address">
              <h3>Dirección de Envío</h3>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Ingresa la dirección de envío"
                required
              />
            </div>

            <div className="cart-summary">
              <h3>Resumen de la Compra</h3>
              <p>Total: ${total.toFixed(2).toLocaleString()}</p>
              <h4>Productos:</h4>
              {Object.keys(groupedItems).length > 0 ? (
                <ul>
                  {Object.entries(groupedItems).map(([key, item]) => (
                    <li key={key}>
                      <strong>{item.nombre_producto}:</strong> (x{item.cantidad}) - ${parseFloat(item.precio_producto).toFixed(2).toLocaleString()}
                      {item.opcion_adicional && item.opcion_adicional !== 'Ninguno' && (
                        <div>
                          <strong>Opción adicional:</strong> {item.opcion_adicional} - ${item.precio_adicional > 0 ? item.precio_adicional.toFixed(2).toLocaleString() : '0.00'}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay productos en el carrito.</p>
              )}
            </div>

            <button type="submit" className="checkout-button">Realizar Pedido</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PaymentMethod;
