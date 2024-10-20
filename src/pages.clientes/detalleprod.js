import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const DetalleProducto = () => {
    const location = useLocation();
    const { product } = location.state || {};
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [opcionAdicionalPrecio, setOpcionAdicionalPrecio] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState('ninguno');
    const [dedicatoria, setDedicatoria] = useState('');
    const [notification, setNotification] = useState('');

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
        setOpcionAdicionalPrecio(option === 'chocolate' ? 30000 : option === 'vino' ? 86000 : 0);
    };

    const handleQuantityChange = (event) => {
        const value = Math.max(parseInt(event.target.value, 10), 1);
        setQuantity(value);
    };

    const handleDedicatoriaChange = (event) => {
        setDedicatoria(event.target.value);
    };

    const updateProductPrice = () => {
        const basePrice = product.precio_producto ? parseFloat(product.precio_producto) : 0;
        return basePrice + opcionAdicionalPrecio; // Asegúrate de que `opcionAdicionalPrecio` se esté actualizando correctamente
    };

    const handleAddToCart = async () => {
        const totalPrice = updateProductPrice() * quantity;
        const documento = localStorage.getItem('documento');

        if (!documento) {
            setNotification('Documento no encontrado. Asegúrate de estar autenticado.');
            return;
        }

        try {
            await axios.post('http://localhost:4000/api/carritos', {
                documento,
                id_producto: product.id_producto,
                cantidad: quantity,
                dedicatoria,
                opcion_adicional: selectedOption === 'ninguno' ? undefined : selectedOption,
                precio_adicional: opcionAdicionalPrecio,  // Asegúrate de enviar el precio adicional
                total: totalPrice,
            });
            setNotification('Producto añadido al carrito exitosamente.');
        } catch (error) {
            console.error('Error al agregar al carrito:', error.response ? error.response.data : error.message);
            setNotification(`Error al agregar el producto al carrito: ${error.response?.data?.message || error.message}`);
        }

        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    return (
        <div>
            {isAuthenticated ? <Headerc /> : <Header />}
            <div className="contenedor-detalle">
                <aside className="sidebar">
                    <h2>
                        <Link to="#" className="home-link" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link> / Personalización
                    </h2>
                </aside>

                <section className="detalle-producto">
                    <h2 className="descripcion">Personalización</h2>
                    {notification && <div className="notification">{notification}</div>}
                    <div className="contenido-producto">
                        <div className="imagen-producto">
                            <img src={product.foto_ProductoURL} alt={product.nombre_producto} />
                        </div>
                        <div className="info-producto">
                            <h3>{product.nombre_producto}</h3>
                            <p>{product.descripcion_producto || 'Descripción no disponible.'}</p>
                            <div className="meta-producto">
                                <p><strong>Precio base: ${product.precio_producto ? parseFloat(product.precio_producto).toLocaleString() : '0'}</strong></p>
                                <p><strong>Precio adicional: ${opcionAdicionalPrecio.toLocaleString()}</strong></p>
                                <p><strong>Precio total: ${updateProductPrice().toLocaleString()}</strong></p>
                                <p><strong>Precio total (con cantidad): ${updateProductPrice() * quantity.toLocaleString()}</strong></p>
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
