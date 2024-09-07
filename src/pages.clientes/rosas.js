import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../index.css';

/*Importar imagenes*/
import Ramo1 from '../static/img/Ramo1.jpeg';

const ProductPage = () => {
    const [modalData, setModalData] = useState(null);
    const [filters, setFilters] = useState({
        occasion: '',
        price: null,
        type: ''
    });

    const products = [
        { id: 'product1', name: 'Nombre del Producto 1', price: 50000, type: 'Rosas', occasion: 'Amor y Amistad', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' },
        { id: 'product2', name: 'Nombre del Producto 2', price: 45000, type: 'Tropicales', occasion: 'Cumpleaños', imgSrc: 'assets/img/Ramo1.jpeg' }
        // Añadir más productos aquí
    ];

    const descriptions = {
        'product1': 'Descripción detallada del Producto 1. Perfecto para Amor y Amistad.',
        'product2': 'Descripción detallada del Producto 2. Ideal para Cumpleaños y celebraciones.',
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
        <Header/>
        <div className="container">
            <aside className="sidebar">
                <h2>
                    <a href="index.html" className="home-link">
                        <i className="fa-solid fa-house"></i>
                    </a> / Rosas
                </h2>
                <div className="filter">
                    <h3>Ocasión</h3>
                    <ul>
                        <li><input type="checkbox" id="occasion" onChange={handleFilterChange} /> Amor y Amistad</li>
                        <li><input type="checkbox" id="cumpleanos" onChange={handleFilterChange} /> Cumpleaños</li>
                    </ul>
                </div>
                <div className="filter">
                    <h3>Precio</h3>
                    <ul>
                        <li><input type="checkbox" id="below-100" onChange={handleFilterChange} /> Debajo de $100.000</li>
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
                                <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                Arreglo floral Lirios de Amor - $350,000
                            </a>
                            <a href="detalle_producto.html" className="filter1">
                                <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                Arreglo floral Lirios de Amor - $350,000
                            </a>
                            <a href="detalle_producto.html" className="filter1">
                                <img src={Ramo1} alt="Arreglo floral Lirios de Amor" className="Ramo1" />
                                Arreglo floral Lirios de Amor - $350,000
                            </a>
                        </li>
                        {/* Añadir más novedades aquí */}
                    </ul>
                </div>
            </aside>

            <main className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card" data-precio={product.price} data-tipo={product.type} data-ocasion={product.occasion}>
                        <img src={Ramo1} alt={product.name} className="product-img" />
                        <h3>{product.name}</h3>
                        <p>${product.price.toLocaleString()}</p>
                        <button className="btn-details" onClick={() => handleDetailsClick(product)}>Ver detalles</button>
                        <a href="detalle_producto.html"><button className="btn-details personalizar">Personalizar</button></a>
                        <button className="btn-cart ">Añadir al carrito</button>
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
        <Footer/>
        </div>
    );
};

export default ProductPage;
