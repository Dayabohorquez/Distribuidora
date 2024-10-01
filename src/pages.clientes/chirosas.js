import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';

/* Importar imágenes */
import Chirosa1 from '../static/img/Chirosas1.jpeg';
import Chirosa2 from '../static/img/Chirosas2.jpeg';
import Chirosa3 from '../static/img/Chirosas3.jpeg';
import Chirosa4 from '../static/img/Chirosas4.jpeg';
import Chirosa5 from '../static/img/Chirosas5.jpeg';
import Chirosa6 from '../static/img/Chirosas6.jpeg';
import Chirosa7 from '../static/img/Chirosas7.jpeg';
import Chirosa8 from '../static/img/Chirosas8.jpeg';
import Chirosa9 from '../static/img/Chirosas9.jpeg';
import { jwtDecode } from 'jwt-decode';

const ProductPage = () => {
    const [modalData, setModalData] = useState(null);
    const [filters, setFilters] = useState({
        occasion: '',
        price: null,
        type: ''
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const products = [
        { id: 'product1', name: 'Nombre del Producto 1', price: 50000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: Chirosa1 },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Chirosa2 },
        { id: 'product3', name: 'Nombre del Producto 3', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Chirosa3 },
        // Añadir más productos aquí
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Producto 1. Perfecto para Amor y Amistad.',
        'product2': 'Descripción detallada del Producto 2. Ideal para Cumpleaños y celebraciones.',
        'product3': 'Descripción detallada del Producto 3. Excelente para cualquier ocasión especial.',
    };

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

    const handleDetailsClick = (product) => {
        setModalData({
            imgSrc: product.imgSrc,
            title: product.name,
            price: `$${product.price.toLocaleString()}`,
            description: descriptions[product.id] || 'Descripción del producto no disponible.'
        });
    };

    const handleFilterChange = (e) => {
        const { id, checked } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [id]: checked ? id : ''
        }));
    };

    const filteredProducts = products.filter(product => {
        const { occasion, price, type } = filters;

        const matchOccasion = !occasion || product.occasion === occasion;
        const matchPrice = !price || (product.price < parseInt(price));
        const matchType = !type || product.type === type;

        return matchOccasion && matchPrice && matchType;
    });

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="container">
                <aside className="sidebar">
                    <h2>
                        <a href="index.html" className="home-link">
                            <i className="fa-solid fa-house"></i>
                        </a> / Chirosas
                    </h2>
                    <div className="filter">
                        <h3>Ocasión</h3>
                        <ul>
                            <li><input type="checkbox" id="Amor y Amistad" onChange={handleFilterChange} /> Amor y Amistad</li>
                            <li><input type="checkbox" id="Cumpleaños" onChange={handleFilterChange} /> Cumpleaños</li>
                        </ul>
                    </div>
                    <div className="filter">
                        <h3>Precio</h3>
                        <ul>
                            <li><input type="checkbox" id="below-100" onChange={handleFilterChange} /> Inferior a $100.000</li>
                            <li><input type="checkbox" id="between-100-200" onChange={handleFilterChange} /> Entre $100.000 - $200.000</li>
                            <li><input type="checkbox" id="above-200" onChange={handleFilterChange} /> Superior a $200.000</li>
                        </ul>
                    </div>
                    <div className="filter">
                        <h3>Tipo de Flor</h3>
                        <ul>
                            <li><input type="checkbox" id="Rosas" onChange={handleFilterChange} /> Rosas</li>
                            <li><input type="checkbox" id="Tropicales" onChange={handleFilterChange} /> Flores Tropicales</li>
                            <li><input type="checkbox" id="Surtidas" onChange={handleFilterChange} /> Flores Surtidas</li>
                        </ul>
                    </div>
                </aside>

                <main className="product-grid2">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.imgSrc} alt={product.name} className="product-img" />
                            <h3>{product.name}</h3>
                            <p>${product.price.toLocaleString()}</p>
                            <button className="btn-details" onClick={() => handleDetailsClick(product)}>Ver detalles</button>
                            <button className="btn-cart">Añadir al carrito</button>
                        </div>
                    ))}
                </main>

                {modalData && (
                    <div id="product-modal" className="modal" style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <span className="close-modal" onClick={() => setModalData(null)}>&times;</span>
                            <div className="modal-body">
                                <img id="modal-img" src={modalData.imgSrc} alt="Producto" className="modal-img" />
                                <div className="modal-text">
                                    <h3 id="modal-title">{modalData.title}</h3>
                                    <p id="modal-description">{modalData.description}</p>
                                    <p id="modal-price">{modalData.price}</p>
                                    <button className="btn-cart">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default ProductPage;
