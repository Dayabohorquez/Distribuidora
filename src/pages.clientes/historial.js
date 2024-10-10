import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      }
    }
  }, []);

  const fetchOrderHistory = async (documento) => {
    try {
      const response = await fetch(`http://localhost:4000/api/usuarios/${documento}/historial`);
      if (!response.ok) {
        throw new Error('Error al obtener el historial de pedidos');
      }
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
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
                  <tr key={`${order.id_historial}-${index}`}>
                  <td>{order.nombre_producto}</td>
                  <td>{order.codigo_producto}</td>
                  <td>${Math.floor(order.precio)}</td> {/* O puedes usar parseInt(order.precio) */}
                  <td>{order.cantidad}</td>
                  <td>{order.estado_pedido}</td>
                  <td>${Math.floor(order.total_pagado)}</td> {/* O puedes usar parseInt(order.total_pagado) */}
              </tr>
              
                ))}
              </tbody>
            </table>
          </div>
          <div className="his6-boton-container">
            <button className="his3-continuar-btn" onClick={() => window.location.href = '/'}>
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
