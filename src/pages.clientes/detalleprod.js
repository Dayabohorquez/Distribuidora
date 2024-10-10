import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import { useLocation, useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';

const DetalleProducto = ({ addToCart }) => {
    const location = useLocation();
    const { product } = location.state || {};
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [opcionAdicionalPrecio, setOpcionAdicionalPrecio] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('ninguno');
    const [dedicatoria, setDedicatoria] = useState('');

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

    if (!product) {
        return (
            <div>
                {isAuthenticated ? <Headerc /> : <Header />}
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
        setSelectedOption(option);

        // Establecer el precio adicional según la opción seleccionada
        if (option === 'chocolate') {
            setOpcionAdicionalPrecio(30000);
        } else if (option === 'vino') {
            setOpcionAdicionalPrecio(86000);
        } else {
            setOpcionAdicionalPrecio(0);
        }
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setQuantity(value > 0 ? value : 1);
    };

    const handleDedicatoriaChange = (event) => {
        setDedicatoria(event.target.value);
    };

    const updateProductPrice = () => {
        const basePrice = product.precio_producto ? parseFloat(product.precio_producto) : 0; 
        return (basePrice + opcionAdicionalPrecio) * quantity;
    };

    const handleAddToCart = () => {
        const totalPrice = updateProductPrice(); // Cambié esto para usar la función correcta
        addToCart({ ...product, quantity, totalPrice, dedicatoria });
        navigate('/myaccount'); 
    };

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="contenedor-detalle">
                <aside className="sidebar">
                    <h2>
                        <a href="#" className="home-link" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </a> / Personalización
                    </h2>
                </aside>

                <section className="detalle-producto">
                    <h2 className="descripcion">Personalización</h2>
                    <div className="contenido-producto">
                        <div className="imagen-producto">
                            <img src={product.foto_ProductoURL} alt={product.nombre_producto} />
                        </div>
                        <div className="info-producto">
                            <h3>{product.nombre_producto}</h3>
                            <p>{product.descripcion_producto || 'Descripción no disponible.'}</p>
                            <div className="meta-producto">
                                <p><strong>Precio base: ${product.precio_producto.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></p>
                                <p><strong>Precio total: ${updateProductPrice().toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></p>
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

                                <label htmlFor="dedicatoria">Dedicatoria:</label>
                                <input
                                    type="text"
                                    id="dedicatoria"
                                    value={dedicatoria}
                                    onChange={handleDedicatoriaChange}
                                    placeholder="Escribe tu dedicatoria aquí"
                                />
                            </div>
                            <div className="botones">
                                <button className="btn-comprar-producto" onClick={handleAddToCart}>Añadir al carrito</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default DetalleProducto;
