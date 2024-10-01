import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';

// Importar imágenes
import funebreImg from '../static/img/Funebre.jpeg';
import funebre1Img from '../static/img/Funebre1.jpeg';
import funebre2Img from '../static/img/Funebre2.jpeg';
import funebre3Img from '../static/img/Funebre3.jpeg';
import funebre4Img from '../static/img/Funebre4.jpeg';
import Oferta1 from '../static/img/Oferta1.png';
import Oferta2 from '../static/img/Oferta2.png';
import Oferta3 from '../static/img/Oferta3.png';
import ramilleteImg from '../static/img/Ramillete.jpeg';
import ramillete1Img from '../static/img/Ramillete1.jpeg';
import ramillete2Img from '../static/img/Ramillete2.jpeg';
import ramillete3Img from '../static/img/Ramillete3.jpeg';
import ramillete4Img from '../static/img/ramillete4.jpeg';
import ramobaseImg from '../static/img/Ramobase.jpeg';
import ramoBase1Img from '../static/img/ramoBase1.jpeg';
import ramoBase2Img from '../static/img/ramoBase2.jpeg';
import ramoBase3Img from '../static/img/ramoBase3.jpeg';
import ramoBase4Img from '../static/img/ramoBase4.jpeg';

const HomePage = () => {
  const [main, setMain] = useState(0);
  const slidesRef = useRef(null);
  const prevButtonRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: 'Ramo en Base 1',
      img: ramobaseImg,
      description: 'Descripción del ramo en base 1.',
      price: 25000,
    },
    {
      id: 2,
      title: 'Ramo en Base 2',
      img: ramoBase1Img,
      description: 'Descripción del ramo en base 2.',
      price: 25000,
    },
    {
      id: 3,
      title: 'Ramo en Base 3',
      img: ramoBase2Img,
      description: 'Descripción del ramo en base 3.',
      price: 25000,
    },
    {
      id: 4,
      title: 'Ramo en Base 4',
      img: ramoBase3Img,
      description: 'Descripción del ramo en base 4.',
      price: 25000,
    },
    {
      id: 5,
      title: 'Ramo en Base 4',
      img: ramoBase4Img,
      description: 'Descripción del ramo en base 4.',
      price: 25000,
    },
    {
      id: 6,
      title: 'Ramillete 1',
      img: ramilleteImg,
      description: 'Descripción del ramillete 1.',
      price: 25000,
    },
    {
      id: 7,
      title: 'Ramillete 2',
      img: ramillete1Img,
      description: 'Descripción del ramillete 2.',
      price: 25000,
    },
    {
      id: 8,
      title: 'Ramillete 3',
      img: ramillete2Img,
      description: 'Descripción del ramillete 3.',
      price: 25000,
    },
    {
      id: 9,
      title: 'Ramillete 4',
      img: ramillete3Img,
      description: 'Descripción del ramillete 4.',
      price: 25000,
    },
    {
      id: 10,
      title: 'Ramillete 4',
      img: ramillete4Img,
      description: 'Descripción del ramillete 4.',
      price: 25000,
    },
    {
      id: 11,
      title: 'Funebre 1',
      img: funebreImg,
      description: 'Descripción del funebre 1.',
      price: 25000,
    },
    {
      id: 12,
      title: 'Funebre 2',
      img: funebre1Img,
      description: 'Descripción del funebre 2.',
      price: 25000,
    },
    {
      id: 13,
      title: 'Funebre 3',
      img: funebre2Img,
      description: 'Descripción del funebre 3.',
      price: 25000,
    },
    {
      id: 14,
      title: 'Funebre 4',
      img: funebre3Img,
      description: 'Descripción del funebre 4.',
      price: 25000,
    },
    {
      id: 15,
      title: 'Funebre 4',
      img: funebre4Img,
      description: 'Descripción del funebre 4.',
      price: 25000,
    },
  ];

  const handleProductClick = (product) => {
    navigate(`/producto/${product}`);
  };
  
  const images = [Oferta1, Oferta2, Oferta3];
  const totalSlides = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setMain((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const slides = slidesRef.current;
    if (slides) {
      slides.style.transform = `translateX(-${main * 100}%)`;
      slides.style.transition = 'transform 0.5s ease-in-out';
    }
  }, [main]);

  return (
    <div>
      {isAuthenticated ? <Headerc /> : <Header/>}
      <center>
        <section className="carousel">
          <div className="carousel-container">
            <div
              className="carousel-slide"
              ref={slidesRef}
              style={{
                display: 'flex',
                width: `${totalSlides * 100}%`,
                flexDirection: 'row',
              }}
            >
              {images.map((img, index) => (
                <div className="carousel-item" key={index} style={{ minWidth: '100%' }}>
                  <img src={img} alt={`Oferta ${index + 1}`} style={{ width: '95%', height: '600px', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </center>

      <section className="section-details">
        <h2>Ramos en Base</h2>
        <div className="product-grid">
          {[ramobaseImg, ramoBase1Img, ramoBase2Img, ramoBase3Img, ramoBase4Img].map((img, index) => (
            <div className="product-item" key={index} onClick={() => handleProductClick(index + 1)}>
              <img src={img} alt={`Ramo en Base ${index + 1}`} />
              <h3>RAMO EN BASE</h3>
              <p>$25,000</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-details">
        <h2>Ramilletes</h2>
        <div className="product-grid">
          {[ramilleteImg, ramillete1Img, ramillete2Img, ramillete3Img, ramillete4Img].map((img, index) => (
            <div className="product-item" key={index} onClick={() => handleProductClick(index + 6)}>
              <img src={img} alt={`Ramo en Base ${index + 1}`} />
              <h3>RAMILLETE</h3>
              <p>$25,000</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-details">
        <h2>Funebres</h2>
        <div className="product-grid">
          {[funebreImg, funebre1Img, funebre2Img, funebre3Img, funebre4Img].map((img, index) => (
            <div className="product-item" key={index} onClick={() => handleProductClick(index + 11)}>
              <img src={img} alt={`Funebre ${index + 1}`} />
              <h3>FUNEBRES</h3>
              <p>$25,000</p>
            </div>
          ))}
        </div>
      </section>
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

export default HomePage;