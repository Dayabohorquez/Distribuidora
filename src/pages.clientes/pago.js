// src/pages/PaymentMethod.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

const PaymentMethod = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const closeDropdowns = (dropdowns) => {
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    };

    const account = document.querySelector('.account');
    const specialDates = document.querySelector('.special-dates');

    const toggleDropdown = (dropdown) => {
      dropdown.classList.toggle('active');
      closeDropdowns([account, specialDates].filter(d => d !== dropdown));
    };

    account.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown(account);
    });

    specialDates.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleDropdown(specialDates);
    });

    document.addEventListener('click', () => closeDropdowns([account, specialDates]));

    return () => {
      paymentOptions.forEach(option => option.removeEventListener('change', () => {}));
      account.removeEventListener('click', () => {});
      specialDates.removeEventListener('click', () => {});
    };
  }, []);

  return (
    <>
      {isAuthenticated ? <Headerc /> : <Header />}
      <main className="payment-method-container">
        <h1>Método de Pago</h1>
        <section className="section payment-method">
          <h2>Selecciona tu Método de Pago</h2>
          <form>
            {['nequi', 'bancolombia', 'efectivo'].map(method => (
              <div className="payment-option" key={method}>
                <input 
                  type="radio" 
                  id={method} 
                  name="payment-method" 
                  value={method} 
                  defaultChecked={method === 'nequi'} 
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
                  style={{ display: method === 'nequi' ? 'block' : 'none' }} 
                  key={method}
                >
                  <label htmlFor={`${method}-number`}>
                    {method === 'efectivo' ? 'Monto en Efectivo' : `Número de ${method.charAt(0).toUpperCase() + method.slice(1)}:`}
                  </label>
                  <input type="text" id={`${method}-number`} name={`${method}-number`} />
                </div>
              ))}
            </div>
            <button className="submit-btn" type="submit">Realizar Pago</button>
          </form>
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

export default PaymentMethod;
