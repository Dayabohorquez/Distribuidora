import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import { FaWhatsapp } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import '../index.css';

/* Importar imágenes */
import Aniversario1 from '../static/img/Aniversario1.jpeg';
import Aniversario2 from '../static/img/Aniversario2.jpeg';
import Aniversario3 from '../static/img/Aniversario3.jpeg';
import Aniversario4 from '../static/img/Aniversario4.jpeg';
import Aniversario5 from '../static/img/Aniversario5.jpeg';
import Aniversario6 from '../static/img/Aniversario6.jpeg';
import Aniversario7 from '../static/img/Aniversario7.jpeg';
import Aniversario8 from '../static/img/Aniversario8.jpeg';
import Aniversario9 from '../static/img/Aniversario9.jpeg';

const ProductPage = () => {
    const [modalData, setModalData] = useState(null);
    const [filters, setFilters] = useState({
        occasion: '',
        price: null,
        type: ''
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(!!decoded.rol); // Verificar si hay un rol
            } catch (e) {
                console.error('Error decodificando el token', e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const products = [
        { id: 'product1', name: 'Ramo de Rosas Rojas', price: 50000, type: 'Rosas', occasion: 'Aniversario', imgSrc: Aniversario1 },
        { id: 'product2', name: 'Ramo de Lirios', price: 60000, type: 'Lirios', occasion: 'Aniversario', imgSrc: Aniversario2 },
        { id: 'product3', name: 'Ramo Surtido', price: 70000, type: 'Surtido', occasion: 'Aniversario', imgSrc: Aniversario3 },
        { id: 'product4', name: 'Ramo de Tulipanes', price: 80000, type: 'Tulipanes', occasion: 'Aniversario', imgSrc: Aniversario4 },
        { id: 'product5', name: 'Ramo de Orquídeas', price: 90000, type: 'Orquídeas', occasion: 'Aniversario', imgSrc: Aniversario5 },
        { id: 'product6', name: 'Ramo de Margaritas', price: 100000, type: 'Margaritas', occasion: 'Aniversario', imgSrc: Aniversario6 },
        { id: 'product7', name: 'Ramo de Gerberas', price: 110000, type: 'Gerberas', occasion: 'Aniversario', imgSrc: Aniversario7 },
        { id: 'product8', name: 'Ramo de Claveles', price: 120000, type: 'Claveles', occasion: 'Aniversario', imgSrc: Aniversario8 },
        { id: 'product9', name: 'Ramo de Fresias', price: 130000, type: 'Fresias', occasion: 'Aniversario', imgSrc: Aniversario9 },
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Ramo de Rosas Rojas.',
        'product2': 'Descripción detallada del Ramo de Lirios.',
        'product3': 'Descripción detallada del Ramo Surtido.',
        // Añadir más descripciones si es necesario
    };

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
            [id]: checked
        }));
    };

    const filteredProducts = products.filter(product => {
        const { occasion, price, type } = filters;

        const matchOccasion = !occasion || product.occasion === occasion;
        const matchPrice = !price || (product.price < price);
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
                        </a> / Aniversario
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
                            <li><input type="checkbox" id="rosas" onChange={handleFilterChange} /> Rosas</li>
                            <li><input type="checkbox" id="tropicales" onChange={handleFilterChange} /> Flores Tropicales</li>
                            <li><input type="checkbox" id="surtidas" onChange={handleFilterChange} /> Flores Surtidas</li>
                        </ul>
                    </div>
                    <div className="filter">
                        <h3>Novedades</h3>
                        <ul>
                            <li>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={Aniversario1} alt="Ramo de Rosas Rojas" className="Ramo1" />
                                    Ramo de Rosas Rojas - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={Aniversario2} alt="Ramo de Lirios" className="Ramo1" />
                                    Ramo de Lirios - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={Aniversario3} alt="Ramo Surtido" className="Ramo1" />
                                    Ramo Surtido - $350,000
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
