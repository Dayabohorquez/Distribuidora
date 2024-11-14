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

  // Verifica si el usuario está autenticado y obtiene el historial de pedidos
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(!!decoded.rol); // Verifica si el usuario tiene rol
        fetchOrderHistory(decoded.documento); // Obtiene el historial
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        localStorage.removeItem('token');
        navigate('/login'); // Redirige al login si no puede decodificar el token
      }
    } else {
      navigate('/login'); // Redirige al login si no está autenticado
    }
  }, [navigate]);

  // Función para obtener el historial de pedidos desde la API
  const fetchOrderHistory = async (documento) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/historial/${documento}`);
      if (!response.ok) {
        throw new Error('Error al obtener el historial de pedidos');
      }
      const data = await response.json();
      setOrders(data); // Guarda los pedidos en el estado
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('No se pudo cargar el historial de pedidos. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el total de pago con el símbolo de moneda
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  // Función para cancelar el pedido y devolver productos al stock
  const cancelarPedido = async (id_pedido) => {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;

    if (decoded && decoded.documento) {
      try {
        // Cancelar el pedido
        const cancelResponse = await fetch(`http://localhost:4000/api/pedidos/cancelar/${id_pedido}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ documento: decoded.documento }),
        });

        if (!cancelResponse.ok) {
          throw new Error('Error al cancelar el pedido');
        }

        // Actualiza el historial de pedidos después de cancelar
        fetchOrderHistory(decoded.documento);
      } catch (error) {
        console.error('Error al cancelar el pedido:', error);
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
                    <th>Fecha de Entrega</th>
                    <th>Estado de Envío</th>
                    <th>Detalles de Compra</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id_pedido}>
                      <td>{order.fecha_pedido}</td>
                      <td>{order.metodo_pago}</td>
                      <td>{formatCurrency(order.total_pagado)}</td>
                      <td>{order.direccion_envio}</td>
                      <td>{order.fecha_entrega}</td> {/* Aquí se aplica el formateo */}
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
