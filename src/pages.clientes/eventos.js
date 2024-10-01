import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import { jwtDecode } from 'jwt-decode';

import Boda from '../static/img/boda.jpg';
import Evento1 from '../static/img/Eventos1.jpeg';
import Evento2 from '../static/img/Eventos2.jpeg';
import Evento3 from '../static/img/Eventos3.jpeg';
import Evento4 from '../static/img/Eventos4.jpeg';

const EventosPage = () => {
    const eventos = [
        { nombre: 'Matrimonios', descripcion: 'Celebra el día más especial con nosotros.', imgSrc: Boda, link: '/aniversario' },
        { nombre: 'Primera Comunión', descripcion: 'Una ocasión espiritual que recordarán siempre.', imgSrc: Evento1, link: '/comunion' },
        { nombre: 'Bautizo', descripcion: 'El inicio de un camino lleno de bendiciones.', imgSrc: Evento2, link: '/bautizo' },
        { nombre: 'Cumpleaños', descripcion: 'Haz que cada año sea inolvidable.', imgSrc: Evento3, link: '/cumpleanos' },
        { nombre: 'Graduación', descripcion: 'Celebra tus logros con estilo y elegancia.', imgSrc: Evento4, link: '/graduacion' }
    ];

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    const DropdownEventos = () => (
        <ul className="dropdown special-dates-dropdown">
            {eventos.map((evento, index) => (
                <li key={index}>
                    <Link to={evento.link}>
                        <i className={`fa fa-${evento.nombre.toLowerCase().replace(/\s+/g, '-')}`} aria-hidden="true"></i>
                        {evento.nombre}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="hero-section">
                <h1>Eventos Memorables</h1>
                <p>Organizamos el evento perfecto para cualquier ocasión. ¡Hacemos realidad tus sueños!</p>
            </div>
            <DropdownEventos />
            <div className="eventos-grid">
                {eventos.map((evento, index) => (
                    <div key={index} className="evento-card">
                        <img src={evento.imgSrc} alt={evento.nombre} className="evento-img" />
                        <div className="evento-content">
                            <h3>{evento.nombre}</h3>
                            <p>{evento.descripcion}</p>
                            <Link to={evento.link}>
                                <button className="btn-contact">Ver Más</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

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
        </div>
    );
};

export default EventosPage;
