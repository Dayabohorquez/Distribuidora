// src/pages.clientes/main.js

import React, { useEffect, useState, useRef } from 'react';
import '../index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';


// Importar imágenes
import eventoImg from '../static/img/evento.jpeg';
import ramobaseImg from '../static/img/Ramobase.jpeg';
import ramoBase1Img from '../static/img/ramoBase1.jpeg';
import ramoBase2Img from '../static/img/ramoBase2.jpeg';
import ramoBase3Img from '../static/img/ramoBase3.jpeg';
import ramoBase4Img from '../static/img/ramoBase4.jpeg';
import ramilleteImg from '../static/img/Ramillete.jpeg';
import ramillete1Img from '../static/img/Ramillete1.jpeg';
import ramillete2Img from '../static/img/Ramillete2.jpeg';
import ramillete3Img from '../static/img/Ramillete3.jpeg';
import ramillete4Img from '../static/img/ramillete4.jpeg';
import funebre3Img from '../static/img/Funebre3.jpeg';
import funebreImg from '../static/img/Funebre.jpeg';
import funebre4Img from '../static/img/Funebre4.jpeg';
import funebre1Img from '../static/img/Funebre1.jpeg';
import funebre2Img from '../static/img/Funebre2.jpeg';

const HomePage = () => {
    const [main, setMain] = useState(0);
    const slidesRef = useRef(null);
    const nextButtonRef = useRef(null);
    const prevButtonRef = useRef(null);

    useEffect(() => {
        const slides = slidesRef.current;
        if (!slides) return;

        const items = Array.from(slides.children);
        const totalSlides = items.length;
        const slideWidth = items[0].clientWidth;

        // Clonamos la primera imagen al final para el desplazamiento continuo
        const firstSlide = items[0].cloneNode(true);
        slides.appendChild(firstSlide);

        slides.style.width = `${(totalSlides + 1) * 100}%`;
        slides.style.transition = 'transform 0.5s ease';

        const showSlide = (n) => {
            const offset = n * slideWidth;
            slides.style.transform = `translateX(-${offset}px)`;
        };

        const nextSlide = () => {
            setMain(prevIndex => (prevIndex + 1) % totalSlides);
            showSlide((main + 1) % totalSlides);
        };

        const prevSlide = () => {
            setMain(prevIndex => (prevIndex - 1 + totalSlides) % totalSlides);
            showSlide((main - 1 + totalSlides) % totalSlides);
        };

        const nextButton = nextButtonRef.current;
        const prevButton = prevButtonRef.current;

        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);

        return () => {
            if (nextButton) nextButton.removeEventListener('click', nextSlide);
            if (prevButton) prevButton.removeEventListener('click', prevSlide);
        };
    }, [main]);

    return (
        <div>
            <Header />
            <section className="carousel">
                <div className="carousel-container">
                    <div className="carousel-slide" ref={slidesRef}>
                        <div className="carousel-item">
                            <img src={eventoImg} alt="Evento 2" />
                        </div>
                        <div className="carousel-item">
                            <img src={eventoImg} alt="Evento 2" />
                        </div>
                        <div className="carousel-item">
                            <img src={eventoImg} alt="Evento 3" />
                        </div>
                    </div>
                </div>
                <button className="prev" ref={prevButtonRef}>&#10094;</button>
                <button className="next" ref={nextButtonRef}>&#10095;</button>
            </section>

            <section className="section-details">
                <h2>Ramos en Base</h2>
                <div className="product-grid">
                    <div className="product-item">
                        <img src={ramobaseImg} alt="Ramo en Base"/>
                        <h3>RAMO EN BASE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramoBase1Img} alt="Ramo en Base"/>
                        <h3>RAMO EN BASE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramoBase2Img} alt="Ramo en Base"/>
                        <h3>RAMO EN BASE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramoBase3Img} alt="Ramo en Base"/>
                        <h3>RAMO EN BASE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramoBase4Img} alt="Ramo en Base"/>
                        <h3>RAMO EN BASE</h3>
                        <p>$25,000</p>
                    </div>
                </div>
            </section>

            <section className="section-details">
                <h2>Ramilletes</h2>
                <div className="product-grid">
                    <div className="product-item">
                        <img src={ramilleteImg} alt="Ramillete"/>
                        <h3>RAMILLETE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramillete1Img} alt="Ramillete"/>
                        <h3>RAMILLETE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramillete2Img} alt="Ramillete"/>
                        <h3>RAMILLETE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramillete3Img} alt="Ramillete"/>
                        <h3>RAMILLETE</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={ramillete4Img} alt="Ramillete"/>
                        <h3>RAMILLETE</h3>
                        <p>$25,000</p>
                    </div>
                </div>
            </section>

            <section className="section-details">
                <h2>Funebres</h2>
                <div className="product-grid">
                    <div className="product-item">
                        <img src={funebre3Img} alt="Funebres"/>
                        <h3>FUNEBRES</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={funebreImg} alt="Funebres"/>
                        <h3>FUNEBRES</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={funebre4Img} alt="Funebres"/>
                        <h3>FUNEBRES</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={funebre1Img} alt="Funebres"/>
                        <h3>FUNEBRES</h3>
                        <p>$25,000</p>
                    </div>
                    <div className="product-item">
                        <img src={funebre2Img} alt="Funebres"/>
                        <h3>FUNEBRES</h3>
                        <p>$25,000</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
