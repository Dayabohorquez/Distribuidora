import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PaymentMethod = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { cartItems = [], subtotal = 0 } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      setNotification({ message: 'El carrito está vacío.', type: 'error' });
      return;
    }

    const id_carrito_item = cartItems[0]?.id_carrito_item;
    if (!id_carrito_item) {
      setNotification({ message: 'El ID del carrito no está disponible.', type: 'error' });
      return;
    }

    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    setLoading(true);
    try {
      const documento = localStorage.getItem('documento');
      if (!documento) {
        setNotification({ message: 'Documento no encontrado. Inicie sesión nuevamente.', type: 'error' });
        return;
      }

      const paymentAndOrderData = {
        pagoData: {
          nombre_pago: `Pago por ${paymentMethod}`,
          fecha_pago: new Date().toISOString(),
          iva: parseFloat(iva.toFixed(2)),
          metodo_pago: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
          subtotal_pago: parseFloat(subtotal.toFixed(2)),
          total_pago: parseFloat(total.toFixed(2)),
          documento,
          id_carrito_item,
        },
        pedidoData: {
          fecha_pedido: new Date().toISOString(),
          total_pagado: parseFloat(total.toFixed(2)),
          documento,
          id_carrito_item,
        }
      };

      const response = await axios.post('http://localhost:4000/api/pago-y-pedido', paymentAndOrderData);

      if (response.data.message === "Pago y pedido creados exitosamente") {
        const vaciarResponse = await axios.delete(`http://localhost:4000/api/carritos/vaciar/${documento}`);
        if (vaciarResponse.status === 200) {
          setNotification({ message: 'Pago realizado y pedido creado exitosamente!', type: 'success' });
        } else {
          throw new Error("Error al vaciar el carrito");
        }
      } else {
        throw new Error("Error al crear el pago y el pedido");
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      const errorMessage = error.response?.data?.message || 'Error al procesar el pago. Inténtalo de nuevo.';
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <>
      {isAuthenticated ? <Headerc /> : <Header />}
      <main className="payment-method-container">
        <h1>Método de Pago</h1>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
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
                  <input type="text" id={`${method}-number`} name={`${method}-number`} required />
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Resumen de la Compra</h3>
              <p>Total: ${total.toFixed(2).toLocaleString()}</p>
              <h4>Productos:</h4>
              <ul>
                {cartItems.map(item => (
                  <li key={item.id_carrito_item}>
                    {item.nombre_producto} (x{item.cantidad}) - ${Number(item.precio_producto).toFixed(2).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>Realizar Pago</button>
          </form>
        </section>
      </main>
      <a
        href="https://wa.me/3222118028"
        className="whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} />
      </a>
      <Footer />
    </>
  );
};

export default PaymentMethod;
