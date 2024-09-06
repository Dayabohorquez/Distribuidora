import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const OrderHistory = () => {
  const orders = [
    { id: 101, date: '2024-09-04', time: '14:35', details: '2x Arreglo floral Red Lila, 1x Escala de Amor' },
    { id: 102, date: '2024-09-03', time: '09:15', details: '3x Amor Verdadero, 2x Amistad Sincera' },
    { id: 103, date: '2024-09-01', time: '11:50', details: '1x Cariño Eterno, 1x Flor Azul' }
  ];

  const handleContinue = () => {
    alert('Ir a la siguiente página');
  };

  return (
    <>
      <Header />
      <main>
        <div className="his1-historial-container">
          <div className="his2-historial-header">
            <h2>Historial de Pedidos</h2>
          </div>
          <div className="his4-historial-content">
            <table className="his5-historial-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Detalles del Pedido</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.time}</td>
                    <td>{order.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="his6-boton-container">
            <button className="his3-continuar-btn" onClick={handleContinue}>Continuar</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderHistory;
