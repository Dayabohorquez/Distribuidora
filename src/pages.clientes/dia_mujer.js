import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

/* Importar imágenes */
import DiaMujer1 from '../static/img/diamujer1.jpeg';
import DiaMujer2 from '../static/img/diamujer2.jpeg';
import DiaMujer3 from '../static/img/diamujer3.jpeg';
import DiaMujer4 from '../static/img/diamujer4.jpeg';
import DiaMujer5 from '../static/img/diamujer5.jpeg';
import DiaMujer6 from '../static/img/diamujer6.jpeg';
import DiaMujer7 from '../static/img/diamujer7.jpeg';
import DiaMujer8 from '../static/img/diamujer8.jpeg';
import DiaMujer9 from '../static/img/diamujer9.jpeg';

const ProductPage = () => {
    const [modalData, setModalData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [filters, setFilters] = useState({
        occasion: '',
        price: null,
        type: ''
    });

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

    const products = [
        { id: 'product1', name: 'Ramo de Rosas', price: 50000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: DiaMujer1, description: 'Descripción del Ramo de Rosas.' },
        { id: 'product2', name: 'Ramo de Lirios', price: 70000, type: 'Lirios', occasion: 'Cumpleaños', imgSrc: DiaMujer2, description: 'Descripción del Ramo de Lirios.' },
        { id: 'product3', name: 'Ramo Surtido', price: 60000, type: 'Surtido', occasion: 'Amor y Amistad', imgSrc: DiaMujer3, description: 'Descripción del Ramo Surtido.' },
        { id: 'product4', name: 'Ramo Tropical', price: 80000, type: 'Tropical', occasion: 'Cumpleaños', imgSrc: DiaMujer4, description: 'Descripción del Ramo Tropical.' },
        { id: 'product5', name: 'Ramo Elegante', price: 90000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: DiaMujer5, description: 'Descripción del Ramo Elegante.' },
        { id: 'product6', name: 'Ramo Colorido', price: 75000, type: 'Surtido', occasion: 'Amor y Amistad', imgSrc: DiaMujer6, description: 'Descripción del Ramo Colorido.' },
        { id: 'product7', name: 'Ramo Clásico', price: 55000, type: 'Rosas', occasion: 'Cumpleaños', imgSrc: DiaMujer7, description: 'Descripción del Ramo Clásico.' },
        { id: 'product8', name: 'Ramo Especial', price: 65000, type: 'Tropical', occasion: 'Amor y Amistad', imgSrc: DiaMujer8, description: 'Descripción del Ramo Especial.' },
        { id: 'product9', name: 'Ramo de Primavera', price: 85000, type: 'Surtido', occasion: 'Cumpleaños', imgSrc: DiaMujer9, description: 'Descripción del Ramo de Primavera.' },
    ];

    const handleDetailsClick = (product) => {
        setModalData({
            imgSrc: product.imgSrc,
            title: product.name,
            price: `$${product.price.toLocaleString()}`,
            description: product.description
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
        const matchPrice = !price || (price === 'below-100' && product.price < 100000) ||
            (price === 'between-100-200' && product.price >= 100000 && product.price <= 200000) ||
            (price === 'above-200' && product.price > 200000);
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
                        </a> / Día de la Mujer
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
                            <li><input type="checkbox" id="Tropical" onChange={handleFilterChange} /> Flores Tropicales</li>
                            <li><input type="checkbox" id="Surtido" onChange={handleFilterChange} /> Flores Surtidas</li>
                        </ul>
                    </div>
                    <div className="filter">
                        <h3>Novedades</h3>
                        <ul>
                            <li>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={DiaMujer1} alt="Ramo de Rosas" className="Ramo1" />
                                    Ramo de Rosas - $50,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={DiaMujer2} alt="Ramo de Lirios" className="Ramo1" />
                                    Ramo de Lirios - $70,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={DiaMujer3} alt="Ramo Surtido" className="Ramo1" />
                                    Ramo Surtido - $60,000
                                </a>
                            </li>
                            {/* Añadir más novedades aquí */}
                        </ul>
                    </div>
                </aside>

                <main className="product-grid2">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card" data-precio={product.price} data-tipo={product.type} data-ocasion={product.occasion}>
                            <img src={product.imgSrc} alt={product.name} className="product-img" />
                            <h3>{product.name}</h3>
                            <p>${product.price.toLocaleString()}</p>
                            <button className="btn-details" onClick={() => handleDetailsClick(product)}>Ver detalles</button>
                            <a href="/Detailprod"><button className="btn-details personalizar">Personalizar</button></a>
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
