import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';

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

  const cancelarPedido = async (id_pedido) => {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;

    if (decoded && decoded.documento) {
        try {
            const response = await fetch(`http://localhost:4000/api/pedidos/cancelar/${id_pedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ documento: decoded.documento }) // Incluye documento en el cuerpo
            });

            if (!response.ok) {
                throw new Error('Error al cancelar el pedido');
            }

            // Actualizar el historial de pedidos después de cancelar el pedido
            fetchOrderHistory(decoded.documento);
        } catch (error) {
            console.error('Error cancelando el pedido:', error);
            setError('No se pudo cancelar el pedido. Inténtalo más tarde.');
        }
    } else {
        setError('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
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
                    <th>Fecha del Pedido</th>
                    <th>Método de Pago</th>
                    <th>Total Pagado</th>
                    <th>Dirección de Envío</th>
                    <th>Estado de Envío</th>
                    <th>Detalles de Compra</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id_pedido}>
                      <td>{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                      <td>{order.metodo_pago}</td>
                      <td>${parseFloat(order.total_pagado).toLocaleString()}</td>
                      <td>{order.direccion_envio}</td>
                      <td>{order.estado_pedido}</td>
                      <td>{order.productos}</td>
                      <td>
                        <button
                          onClick={order.estado_pedido !== 'Cancelado' ? () => cancelarPedido(order.id_pedido) : null}
                          className={`icon-faxmark ${order.estado_pedido === 'Cancelado' ? 'disabled' : ''}`}
                          disabled={order.estado_pedido === 'Cancelado'}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
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
