import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Importar ícono de WhatsApp
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import Boda from '../static/img/boda.jpg';

const EventosPage = () => {
    const eventos = [
        { nombre: 'Matrimonios', descripcion: 'Celebra el día más especial con nosotros.', imgSrc: Boda},
        { nombre: 'Primera Comunión', descripcion: 'Una ocasión espiritual que recordarán siempre.' },
        { nombre: 'Bautizo', descripcion: 'El inicio de un camino lleno de bendiciones.' },
        { nombre: 'Cumpleaños', descripcion: 'Haz que cada año sea inolvidable.' },
        { nombre: 'Graduación', descripcion: 'Celebra tus logros con estilo y elegancia.' }
    ];

    const navigate = useNavigate();

    const handleContactClick = () => {
        navigate('/Formulario'); // Redirige a la página del formulario de contacto
    };

    return (
        <div>
            <Header />
            <div className="hero-section">
                <h1>Eventos Memorables</h1>
                <p>Organizamos el evento perfecto para cualquier ocasión. ¡Hacemos realidad tus sueños!</p>
            </div>
            <div className="eventos-grid">
                {eventos.map((evento, index) => (
                    <div key={index} className="evento-card">
                        <img src={Boda} alt={evento.nombre} className="evento-img"/>
                        <div className="evento-content">
                            <h3>{evento.nombre}</h3>
                            <p>{evento.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botón de WhatsApp */}
            <a 
                href="https://wa.me/1234567890" 
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
