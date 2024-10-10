import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EventosPage = () => {
    const [eventos, setEventos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
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

        // Obtener eventos desde la API
        const fetchEventos = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/eventos');
                setEventos(response.data);
            } catch (error) {
                console.error('Error al obtener eventos:', error);
            }
        };

        fetchEventos();
    }, []);

    // Mapeo de rutas
    const routeMap = {
        'aniversario': '/aniversario',
        'funeral': '/condolencias',
        'cumpleaños': '/Cumpleaños',
    };

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="hero-section">
                <h1>Eventos Memorables</h1>
                <p>Organizamos el evento perfecto para cualquier ocasión. ¡Hacemos realidad tus sueños!</p>
            </div>
            <div className="eventos-grid">
                {eventos.length > 0 ? (
                    eventos.map((evento) => {
                        console.log('Nombre del evento:', evento.nombre_evento);
                        return (
                            <div key={evento.id_evento} className="evento-card">
                                {evento.foto_eventoURL ? (
                                    <img src={evento.foto_eventoURL} alt={evento.nombre_evento} className="evento-img" />
                                ) : (
                                    <span>Sin imagen</span>
                                )}
                                <div className="evento-content">
                                    <h3>{evento.nombre_evento}</h3>
                                    <p>{evento.descripcion || 'Descripción no disponible'}</p>
                                    <Link to={routeMap[evento.nombre_evento.toLowerCase()] || `/evento/${evento.id_evento}`}>
                                        <button className="evento-btn">Ver Más</button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No hay eventos disponibles.</p>
                )}
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
