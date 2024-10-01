import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';
import { FaWhatsapp } from 'react-icons/fa';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

/* Importar imágenes */
import Cumpleaños1 from '../static/img/Cumpleaños1.jpeg';
import Cumpleaños2 from '../static/img/Cumpleaños2.jpeg';
import Cumpleaños3 from '../static/img/Cumpleaños3.jpeg';

const ProductPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [cart, setCart] = useState([]);
    const [filters, setFilters] = useState({
        occasion: '',
        price: null,
        type: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

    const products = [
        { id: 'product1', name: 'Nombre del Producto 1', price: 50000, type: 'Rosas', occasion: 'Cumpleaños', imgSrc: Cumpleaños1 },
        { id: 'product2', name: 'Nombre del Producto 2', price: 60000, type: 'Rosas', occasion: 'Cumpleaños', imgSrc: Cumpleaños2 },
        { id: 'product3', name: 'Nombre del Producto 3', price: 70000, type: 'Rosas', occasion: 'Cumpleaños', imgSrc: Cumpleaños3 },
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Producto 1. Perfecto para Cumpleaños.',
        'product2': 'Descripción detallada del Producto 2. Ideal para celebraciones.',
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

    const handlePersonalizarClick = (product) => {
        navigate('/producto/' + product.id, { state: { product } });
    };

    const handleAddToCart = (product) => {
        setCart(prevCart => [...prevCart, product]);
        alert(`${product.name} añadido al carrito.`);
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

    const cartTotal = cart.reduce((total, item) => total + item.price, 0);

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="container">
                <aside className="sidebar">
                    <h2>
                        <a href="index.html" className="home-link">
                            <i className="fa-solid fa-house"></i>
                        </a> / Cumpleaños
                    </h2>
                    <div className="filter">
                        <h3>Ocasión</h3>
                        <ul>
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
                            <button className="btn-details personalizar" onClick={() => handlePersonalizarClick(product)}>Personalizar</button>
                            <button className="btn-cart" onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
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
                                    <button className="btn-cart" onClick={() => handleAddToCart({ ...modalData, price: Number(modalData.price.replace(/\D/g, '')) })}>Añadir al carrito</button>
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
