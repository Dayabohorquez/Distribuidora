import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import Boda from '../static/img/boda.jpg';

const EventosPage = () => {
    const eventos = [
        'Matrimonios',
        'Primera Comunion',
        'Bautizo',
        'Cumpleaños',
        'Graduacion'
    ];

    const imagenes = [
        'assets/img/boda.jpg',
        'assets/img/boda.jpg',
        'assets/img/boda.jpg',
        'assets/img/boda.jpg',
        'assets/img/boda.jpg',
        'assets/img/boda.jpg'
    ];

    return (
        <div>
        <Header/>
        <div className="container1">
            <div>
                <h2>
                    <a href="index.html" className="home-link">
                        <i className="fa-solid fa-house"></i>
                    </a> / Eventos
                </h2>
            </div>
            <div>
                <p>
                    Consulte personalmente con nuestros asesores y recibirá una completa guía para que su evento sea inolvidable. <br /> <br />
                    <strong>whatsApp: </strong>3222118028 <strong>Correo:</strong> mari.luzgomez@hotmail.com
                </p>
            </div>
            <div>
                {eventos.map((evento, index) => (
                    <div key={index} className={index === 0 ? "eventos3" : "eventos2"}>
                        <p className="eventos1">{evento}</p>
                    </div>
                ))}
            </div>
            <div className="imagenes-eventos">
                {imagenes.map((imgSrc, index) => (
                    <img key={index} src={Boda} alt={`Imagen de ${eventos[index]}`} className="img-evento" />
                ))}
            </div>
            <div className="imagenes-eventos">
                {imagenes.map((imgSrc, index) => (
                    <img key={index + imagenes.length} src={Boda} alt={`Imagen de ${eventos[index % eventos.length]}`} className="img-evento" />
                ))}
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default EventosPage;
