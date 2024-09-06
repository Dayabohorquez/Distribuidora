// src/pages/PaymentMethod.js
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const PaymentMethod = () => {
  useEffect(() => {
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    paymentOptions.forEach(option => {
      option.addEventListener('change', () => {
        document.querySelectorAll('.payment-details-content').forEach(content => {
          content.style.display = 'none';
        });
        document.getElementById(option.value + '-details').style.display = 'block';
      });
    });

    const account = document.querySelector('.account');
    const specialDates = document.querySelector('.special-dates');

    function closeAllDropdowns() {
      account.classList.remove('active');
      specialDates.classList.remove('active');
    }

    account.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!account.classList.contains('active')) {
        closeAllDropdowns();
        account.classList.add('active');
      } else {
        account.classList.remove('active');
      }
    });

    specialDates.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!specialDates.classList.contains('active')) {
        closeAllDropdowns();
        specialDates.classList.add('active');
      } else {
        specialDates.classList.remove('active');
      }
    });

    document.addEventListener('click', () => {
      closeAllDropdowns();
    });
  }, []);

  return (
    <>
      <Header />
      <main className="payment-method-container">
        <h1>Método de Pago</h1>
        <section className="section payment-method">
          <h2>Selecciona tu Método de Pago</h2>
          <form>
            <div className="payment-option">
              <input type="radio" id="nequi" name="payment-method" value="nequi" defaultChecked />
              <label htmlFor="nequi">Nequi</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="bancolombia" name="payment-method" value="bancolombia" />
              <label htmlFor="bancolombia">Bancolombia</label>
            </div>
            <div className="payment-option">
              <input type="radio" id="efectivo" name="payment-method" value="efectivo" />
              <label htmlFor="efectivo">Efectivo</label>
            </div>
            <div className="payment-details">
              <h3>Detalles del Pago</h3>
              <div id="nequi-details" className="payment-details-content">
                <label htmlFor="nequi-number">Número de Nequi:</label>
                <input type="text" id="nequi-number" name="nequi-number" />
              </div>
              <div id="bancolombia-details" className="payment-details-content" style={{ display: 'none' }}>
                <label htmlFor="bancolombia-account">Número de Cuenta Bancolombia:</label>
                <input type="text" id="bancolombia-account" name="bancolombia-account" />
              </div>
              <div id="efectivo-details" className="payment-details-content" style={{ display: 'none' }}>
                <label htmlFor="efectivo-amount">Monto en Efectivo:</label>
                <input type="text" id="efectivo-amount" name="efectivo-amount" />
              </div>
            </div>
            <button className="submit-btn" type="submit">Realizar Pago</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PaymentMethod;
