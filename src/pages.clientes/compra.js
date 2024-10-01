import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

const PurchasePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(!!decoded.rol); // Verifica si hay un rol
      } catch (e) {
        console.error('Error decodificando el token', e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <>
      {isAuthenticated ? <Headerc /> : <Header />}
      <main className="purchase-container">
        <h1>Hoja de Compra</h1>

        <section className="section client-info">
          <h2>Información del Cliente</h2>
          <p><strong>Nombre:</strong> Juan Pérez</p>
          <p><strong>Dirección:</strong> Calle Falsa 123, Ciudad, País</p>
          <p><strong>Correo Electrónico:</strong> juan.perez@example.com</p>
          <p><strong>Teléfono:</strong> +57 3222118028</p>
        </section>

        <section className="section order-details">
          <h2>Detalles del Pedido</h2>
          <table>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Arreglo Floral Red Lila</td>
                <td>2</td>
                <td>$25.00</td>
                <td>$50.00</td>
              </tr>
              <tr>
                <td>Escala de Amor</td>
                <td>1</td>
                <td>$15.00</td>
                <td>$15.00</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td></td>
                <td></td>
                <td><strong>$65.00</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="section payment-method">
          <h2>Método de Pago</h2>
          <form>
            <div>
              <input type="radio" id="Nequi" name="payment-method" value="Nequi" defaultChecked />
              <label htmlFor="Nequi">Nequi</label>
            </div>
            <div>
              <input type="radio" id="Bancolombia" name="payment-method" value="Bancolombia" />
              <label htmlFor="Bancolombia">Bancolombia</label>
            </div>
            <div>
              <input type="radio" id="Efectivo" name="payment-method" value="Efectivo" />
              <label htmlFor="Efectivo">Efectivo</label>
            </div>
          </form>
        </section>

        <section className="section confirmation-button">
          <Link to="/PaymentMethod" className="confirm-btn">Confirmar Compra</Link>
        </section>
      </main>
      {/* Botón de WhatsApp */}
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

export default PurchasePage;
