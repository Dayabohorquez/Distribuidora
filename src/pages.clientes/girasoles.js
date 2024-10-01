import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

/* Importar imágenes */
import Girasoles1 from '../static/img/Girasoles1.jpeg';
import Girasoles2 from '../static/img/Girasoles2.jpeg';
import Girasoles3 from '../static/img/Girasoles3.jpeg';
import Girasoles4 from '../static/img/Girasoles4.jpeg';
import Girasoles5 from '../static/img/Girasoles5.jpeg';
import Girasoles6 from '../static/img/Girasoles6.jpeg';
import Girasoles7 from '../static/img/Girasoles7.jpeg';
import Girasoles8 from '../static/img/Girasoles8.jpeg';
import Girasoles9 from '../static/img/Girasoles9.jpeg';

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
        { id: 'product1', name: 'Nombre del Producto 1', price: 50000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: Girasoles1 },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles2 },
        { id: 'product3', name: 'Nombre del Producto 3', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles3 },
        { id: 'product4', name: 'Nombre del Producto 4', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles4 },
        { id: 'product5', name: 'Nombre del Producto 5', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles5 },
        { id: 'product6', name: 'Nombre del Producto 6', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles6 },
        { id: 'product7', name: 'Nombre del Producto 7', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles7 },
        { id: 'product8', name: 'Nombre del Producto 8', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles8 },
        { id: 'product9', name: 'Nombre del Producto 9', price: 47000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: Girasoles9 },
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Producto 1. Perfecto para Amor y Amistad.',
        'product2': 'Descripción detallada del Producto 2. Ideal para Cumpleaños y celebraciones.',
        'product3': 'Descripción detallada del Producto 3. Excelente para cualquier ocasión especial.',
        'product4': 'Descripción detallada del Producto 4. Ideal para sorpresas.',
        'product5': 'Descripción detallada del Producto 5. Perfecto para alegrar el día.',
        'product6': 'Descripción detallada del Producto 6. Un regalo único.',
        'product7': 'Descripción detallada del Producto 7. Ideal para celebraciones.',
        'product8': 'Descripción detallada del Producto 8. Perfecto para expresar amor.',
        'product9': 'Descripción detallada del Producto 9. Un hermoso detalle.',
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
                        </a> / Girasoles
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
                                    <img src={Girasoles1} alt="Arreglo floral Girasoles" className="Ramo1" />
                                    Arreglo floral Girasoles - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={Girasoles2} alt="Arreglo floral Girasoles" className="Ramo1" />
                                    Arreglo floral Girasoles - $350,000
                                </a>
                                <a href="detalle_producto.html" className="filter1">
                                    <img src={Girasoles3} alt="Arreglo floral Girasoles" className="Ramo1" />
                                    Arreglo floral Girasoles - $350,000
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
                            <a href="detalle_producto.html"><button className="btn-details personalizar">Personalizar</button></a>
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
