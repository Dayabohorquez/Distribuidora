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
    const [opcionesAdicionales, setOpcionesAdicionales] = useState([]);

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

    useEffect(() => {
        const fetchOpcionesAdicionales = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/opciones-adicionales');
                setOpcionesAdicionales(response.data);
            } catch (error) {
                console.error('Error al obtener las opciones adicionales:', error);
            }
        };

        fetchOpcionesAdicionales();
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
        const selected = opcionesAdicionales.find(op => op.opcion_adicional === option);
        setOpcionAdicionalPrecio(selected ? selected.precio_adicional : 0);
    };

    const handleQuantityChange = (event) => {
        const value = Math.max(parseInt(event.target.value, 10), 1);
        if (value > product.cantidad_disponible) {
            setNotification(`La cantidad no puede exceder ${product.cantidad_disponible}.`);
        } else {
            setNotification('');
        }
        setQuantity(value);
    };

    const handleDedicatoriaChange = (event) => {
        setDedicatoria(event.target.value);
    };

    const updateProductPrice = () => {
        const basePrice = parseInt(product?.precio_producto) || 0;
        return (basePrice + opcionAdicionalPrecio) * quantity;
    };

    const handleAddToCart = async () => {
        const documento = localStorage.getItem('documento');

        if (!documento) {
            setNotification('Por favor, inicie sesión para agregar productos al carrito.');
            return;
        }

        if (quantity < 1 || quantity > product.cantidad_disponible) {
            setNotification('Cantidad no válida.');
            return;
        }

        const selectedOptionId = opcionesAdicionales.find(op => op.opcion_adicional === selectedOption)?.id_opcion;

        try {
            await axios.post('http://localhost:4000/api/carrito-item/agregar', {
                documento,
                id_producto: product.id_producto,
                cantidad: quantity,
                dedicatoria: dedicatoria.trim() || null,
                id_opcion: selectedOptionId || null, // Asegúrate de enviar el ID correcto
            });
            setNotification('Producto agregado al carrito.');
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            setNotification('Error al agregar el producto al carrito.');
        } finally {
            setTimeout(() => setNotification(''), 3000);
        }
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
                                <p>
                                    <strong>
                                        Precio base: ${parseInt(product?.precio_producto).toLocaleString() || '0'}
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        Precio adicional: ${opcionAdicionalPrecio.toLocaleString() || '0'}
                                    </strong>
                                </p>
                                <p>
                                    <strong>
                                        Precio total: ${updateProductPrice().toLocaleString() || '0'}
                                    </strong>
                                </p>
                            </div>
                            <div className="opciones-producto">
                                <h4 className="opciones">Opciones disponibles</h4>
                                <label htmlFor="detalle-adicional">Detalle adicional</label>
                                <select id="detalle-adicional" value={selectedOption} onChange={handleOptionChange}>
                                    <option value="ninguno">Ninguno</option>
                                    {opcionesAdicionales.map(opcion => (
                                        <option key={opcion.id_opcion} value={opcion.opcion_adicional}>
                                            {opcion.opcion_adicional} (+${opcion.precio_adicional.toLocaleString() || '0'})
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="cantidad">Cantidad:</label>
                                <input
                                    type="number"
                                    id="cantidad"
                                    value={quantity}
                                    min="1"
                                    max={product.cantidad_disponible}
                                    onChange={handleQuantityChange}
                                    required
                                />

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
