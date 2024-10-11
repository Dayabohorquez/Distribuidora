import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(!!decoded.rol);
        fetchOrderHistory(decoded.documento);
      } catch (e) {
        console.error('Error decodificando el token', e);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchOrderHistory = async (documento) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/usuarios/${documento}/historial`);
      if (!response.ok) {
        throw new Error('Error al obtener el historial de pedidos');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('No se pudo cargar el historial de pedidos. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated ? <Headerc /> : <Header />}
      <main>
        <div className="his1-historial-container">
          <div className="his2-historial-header">
            <h2>Historial de Pedidos</h2>
          </div>
          <div className="his4-historial-content">
            {loading ? (
              <p>Cargando historial de pedidos...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table className="his5-historial-table">
                <thead>
                  <tr>
                    <th>Nombre del Producto</th>
                    <th>Código del Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Estado del Pedido</th>
                    <th>Total Pagado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={`${order.id_pedido}-${index}`}>
                      <td>{order.nombre_producto}</td>
                      <td>{order.codigo_producto}</td>
                      <td>${order.precio ? order.precio.toLocaleString() : 'N/A'}</td>
                      <td>{order.cantidad}</td>
                      <td>{order.estado_pedido}</td>
                      <td>${order.total_pagado ? order.total_pagado.toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="his6-boton-container">
            <button className="his3-continuar-btn" onClick={() => navigate('/')}>
              Volver
            </button>
          </div>
        </div>
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

export default OrderHistory;
