import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import { FaWhatsapp } from 'react-icons/fa';
import '../index.css';
import { jwtDecode } from 'jwt-decode';

/* Importar imágenes */
import AmorAmistad1 from '../static/img/AmorAmistad1.jpeg';
import AmorAmistad2 from '../static/img/AmorAmistad2.jpeg';
import AmorAmistad3 from '../static/img/AmorAmistad3.jpeg';
import AmorAmistad4 from '../static/img/AmorAmistad4.jpeg';
import AmorAmistad5 from '../static/img/AmorAmistad5.jpeg';
import AmorAmistad6 from '../static/img/AmorAmistad6.jpeg';
import AmorAmistad7 from '../static/img/AmorAmistad7.jpeg';
import AmorAmistad8 from '../static/img/AmorAmistad8.jpeg';
import AmorAmistad9 from '../static/img/AmorAmistad9.jpeg';

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
                setIsAuthenticated(!!decoded.rol); // Comprueba si tiene un rol
            } catch (e) {
                console.error('Error decodificando el token', e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const products = [
        { id: 'product1', name: 'Nombre del Producto 1', price: 50000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad1 },
        { id: 'product2', name: 'Nombre del Producto 2', price: 60000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad2 },
        { id: 'product3', name: 'Nombre del Producto 3', price: 70000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad3 },
        { id: 'product4', name: 'Nombre del Producto 4', price: 80000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad4 },
        { id: 'product5', name: 'Nombre del Producto 5', price: 90000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad5 },
        { id: 'product6', name: 'Nombre del Producto 6', price: 100000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad6 },
        { id: 'product7', name: 'Nombre del Producto 7', price: 110000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad7 },
        { id: 'product8', name: 'Nombre del Producto 8', price: 120000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad8 },
        { id: 'product9', name: 'Nombre del Producto 9', price: 130000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: AmorAmistad9 },
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Producto 1. Perfecto para Amor y Amistad.',
        'product2': 'Descripción detallada del Producto 2. Ideal para Cumpleaños y celebraciones.',
        'product3': 'Descripción detallada del Producto 3. Excelente para cualquier ocasión especial.',
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
                        </a> / Amor y Amistad
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
                                    <img src={AmorAmistad1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                    Arreglo floral Lirios de Amor - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={AmorAmistad2} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                    Arreglo floral Lirios de Amor - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={AmorAmistad3} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                    Arreglo floral Lirios de Amor - $350,000
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
