import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import { useLocation, useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';

const DetailProd = ({ addToCart }) => {
    const location = useLocation();
    const { product } = location.state || {};
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [opcionAdicionalPrecio, setOpcionAdicionalPrecio] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('ninguno');
    
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
    
    if (!product) {
        return (
            <div>
                <Header />
                <div className="contenedor-detalle">
                    <h2>Producto no encontrado</h2>
                    <button onClick={() => navigate('/ProductPage')}>Volver a la página de productos</button>
                </div>
                <Footer />
            </div>
        );
    }

    const handleOptionChange = (event) => {
        const option = event.target.value;
        setOpcionAdicionalPrecio(option === 'chocolate' ? 30000 : option === 'vino' ? 86000 : 0);
        setSelectedOption(option);
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setQuantity(value > 0 ? value : 1);
    };

    const updateProductPrice = () => {
        return (product.price + opcionAdicionalPrecio) * quantity;
    };

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="contenedor-detalle">
                <aside className="sidebar">
                    <h2>
                        <a href="/ProductPage" className="home-link">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </a> / Personalización
                    </h2>
                </aside>

                <section className="detalle-producto">
                    <h2 className="descripcion">Descripción del Producto</h2>
                    <div className="contenido-producto">
                        <div className="imagen-producto">
                            <img src={product.imgSrc} alt={product.name} />
                        </div>
                        <div className="info-producto">
                            <h3>{product.name}</h3>
                            <p>{product.description || 'Descripción no disponible.'}</p>
                            <div className="meta-producto">
                                <p><strong>Precio base: ${product.price.toLocaleString()}</strong></p>
                                <p><strong>Precio total: ${updateProductPrice().toLocaleString()}</strong></p>
                            </div>
                            <div className="opciones-producto">
                                <h4 className="opciones">Opciones disponibles</h4>
                                <label htmlFor="detalle-adicional">Detalle adicional</label>
                                <select id="detalle-adicional" value={selectedOption} onChange={handleOptionChange}>
                                    <option value="ninguno">Ninguno</option>
                                    <option value="chocolate">Chocolate Ferrero Rocher (caja x 8Und) (+$30,000)</option>
                                    <option value="vino">Vino (+$86,000)</option>
                                </select>

                                <label htmlFor="cantidad">Cantidad:</label>
                                <input type="number" id="cantidad" value={quantity} min="1" onChange={handleQuantityChange} required />
                            </div>
                            <div className="botones">
                                <button className="btn-comprar-producto" onClick={() => {
                                    addToCart({
                                        img: product.imgSrc,
                                        title: product.name,
                                        price: updateProductPrice(),
                                        quantity
                                    });
                                    alert('Producto añadido al carrito.');
                                }}>Añadir al carrito</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default DetailProd;
