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
      const response = await fetch(`http://localhost:4000/api/historial/${documento}`);
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
                    <th>ID del Pedido</th>
                    <th>Fecha del Pedido</th>
                    <th>Estado del Pedido</th>
                    <th>Método de Pago</th>
                    <th>Total Pagado</th>
                    <th>Dirección de Envío</th>
                    <th>Detalles de Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const productos = order.productos ? order.productos.split(', ') : [];
                    return (
                      <React.Fragment key={order.id_pedido}>
                        {productos.map((producto, index) => (
                          <tr key={`${order.id_pedido}-${index}`}>
                            {index === 0 && (
                              <>
                                <td rowSpan={productos.length}>{order.id_pedido}</td>
                                <td rowSpan={productos.length}>{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                                <td rowSpan={productos.length}>{order.estado_pedido}</td>
                                <td rowSpan={productos.length}>{order.metodo_pago}</td>
                                <td rowSpan={productos.length}>${parseFloat(order.total_pagado).toLocaleString()}</td>
                                <td rowSpan={productos.length}>{order.direccion_envio}</td>
                              </>
                            )}
                            <td>{producto}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
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
