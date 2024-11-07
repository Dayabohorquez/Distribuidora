import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';

// Importar imágenes
import Oferta1 from '../static/img/Oferta1.png';
import Oferta2 from '../static/img/Oferta2.png';
import Oferta3 from '../static/img/Oferta3.png';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [main, setMain] = useState(0);
  const slidesRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const images = [Oferta1, Oferta2, Oferta3];
  const totalSlides = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setMain((prevIndex) => (prevIndex + 1) % (totalSlides * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const slides = slidesRef.current;
    if (slides) {
      slides.style.transform = `translateX(-${(main % totalSlides) * 100}%)`;
      slides.style.transition = main % totalSlides === 0 ? 'none' : 'transform 0.5s ease-in-out';
    }
  }, [main, totalSlides]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/productos');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Data is not an array:', response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handlePersonalizeClick = (product) => {
    navigate(`/producto/${product.id_producto}`, { state: { product } });
  };

  // Estado para controlar cuántos productos se muestran
  const [visibleCount, setVisibleCount] = useState(5);

  const loadMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Aumenta la cantidad visible en 5 cada vez que se hace clic
  };

  return (
    <div>
      {isAuthenticated ? <Headerc /> : <Header />}
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
        <h2>Productos Disponibles</h2>
        <div className="product-grid">
          {products.slice(0, visibleCount).map((product) => (
            <div className="product-item" key={product.id_producto} onClick={() => handlePersonalizeClick(product)}>
              <img src={product.foto_ProductoURL} alt={product.nombre_producto} />
              <h3>{product.nombre_producto}</h3>
              <p>${parseFloat(product.precio_producto).toLocaleString()}</p>
            </div>

          ))}
        </div>
        <section className="section-btn-container">
  {/* Botón para cargar más productos */}
  {visibleCount < products.length && (
    <button className="load-more-btn" onClick={loadMoreProducts}>Cargar Más</button>
  )}
</section>
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
