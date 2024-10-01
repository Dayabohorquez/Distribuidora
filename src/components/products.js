import React, { useState } from 'react';
import '../index.css';

// Import images for both categories
import ramobaseImg from '../static/img/Ramobase.jpeg';
import ramoBase1Img from '../static/img/ramoBase1.jpeg';
import ramoBase2Img from '../static/img/ramoBase2.jpeg';
import ramoBase3Img from '../static/img/ramoBase3.jpeg';
import ramoBase4Img from '../static/img/ramoBase4.jpeg';
import ramilleteImg from '../static/img/Ramillete.jpeg';
import ramillete1Img from '../static/img/Ramillete1.jpeg';
import ramillete2Img from '../static/img/Ramillete2.jpeg';
import ramillete3Img from '../static/img/Ramillete3.jpeg';
import ramillete4Img from '../static/img/ramillete4.jpeg';
import funebreImg from '../static/img/Funebre.jpeg';
import funebre1Img from '../static/img/Funebre1.jpeg';
import funebre2Img from '../static/img/Funebre2.jpeg';
import funebre3Img from '../static/img/Funebre3.jpeg';
import funebre4Img from '../static/img/Funebre4.jpeg';
import Rosa1 from '../static/img/Rosa1.jpeg';
import Rosa2 from '../static/img/Rosa2.jpeg';
import Rosa3 from '../static/img/Rosa3.jpeg';
import Rosa4 from '../static/img/Rosa4.jpeg';
import Rosa5 from '../static/img/Rosa5.jpeg';
import Rosa6 from '../static/img/Rosa6.jpeg';
import Rosa7 from '../static/img/Rosa7.jpeg';
import Rosa8 from '../static/img/Rosa8.jpeg';
import Rosa9 from '../static/img/Rosa9.jpeg';

const products = [
    // Ramo products
    { id: 1, title: 'Ramo en Base 1', img: ramobaseImg, description: 'Descripción del ramo en base 1.', price: 25000 },
    { id: 2, title: 'Ramo en Base 2', img: ramoBase1Img, description: 'Descripción del ramo en base 2.', price: 25000 },
    { id: 3, title: 'Ramo en Base 3', img: ramoBase2Img, description: 'Descripción del ramo en base 3.', price: 25000 },
    { id: 4, title: 'Ramo en Base 4', img: ramoBase3Img, description: 'Descripción del ramo en base 4.', price: 25000 },
    { id: 5, title: 'Ramo en Base 5', img: ramoBase4Img, description: 'Descripción del ramo en base 5.', price: 25000 },
    { id: 6, title: 'Ramillete 1', img: ramilleteImg, description: 'Descripción del ramillete 1.', price: 25000 },
    { id: 7, title: 'Ramillete 2', img: ramillete1Img, description: 'Descripción del ramillete 2.', price: 25000 },
    { id: 8, title: 'Ramillete 3', img: ramillete2Img, description: 'Descripción del ramillete 3.', price: 25000 },
    { id: 9, title: 'Ramillete 4', img: ramillete3Img, description: 'Descripción del ramillete 4.', price: 25000 },
    { id: 10, title: 'Ramillete 5', img: ramillete4Img, description: 'Descripción del ramillete 5.', price: 25000 },
    { id: 11, title: 'Funebre 1', img: funebreImg, description: 'Descripción del funebre 1.', price: 25000 },
    { id: 12, title: 'Funebre 2', img: funebre1Img, description: 'Descripción del funebre 2.', price: 25000 },
    { id: 13, title: 'Funebre 3', img: funebre2Img, description: 'Descripción del funebre 3.', price: 25000 },
    { id: 14, title: 'Funebre 4', img: funebre3Img, description: 'Descripción del funebre 4.', price: 25000 },
    { id: 15, title: 'Funebre 5', img: funebre4Img, description: 'Descripción del funebre 5.', price: 25000 },

    // Rose products
    { id: 16, title: 'Nombre del Producto 1', img: Rosa1, description: 'Descripción detallada del Producto 1. Perfecto para Amor y Amistad.', price: 50000 },
    { id: 17, title: 'Nombre del Producto 2', img: Rosa2, description: 'Descripción detallada del Producto 2. Ideal para Cumpleaños y celebraciones.', price: 45000 },
    { id: 18, title: 'Nombre del Producto 3', img: Rosa3, description: 'Descripción detallada del Producto 3. Excelente para cualquier ocasión especial.', price: 47000 },
    { id: 19, title: 'Nombre del Producto 4', img: Rosa4, description: 'Descripción del Producto 4. Ideal para cualquier evento.', price: 47000 },
    { id: 20, title: 'Nombre del Producto 5', img: Rosa5, description: 'Descripción del Producto 5. Atractivo y vibrante.', price: 47000 },
    { id: 21, title: 'Nombre del Producto 6', img: Rosa6, description: 'Descripción del Producto 6. Encanto en cada pétalo.', price: 47000 },
    { id: 22, title: 'Nombre del Producto 7', img: Rosa7, description: 'Descripción del Producto 7. Perfecto para dar amor.', price: 47000 },
    { id: 23, title: 'Nombre del Producto 8', img: Rosa8, description: 'Descripción del Producto 8. Flores frescas para ti.', price: 47000 },
    { id: 24, title: 'Nombre del Producto 9', img: Rosa9, description: 'Descripción del Producto 9. Belleza en cada detalle.', price: 47000 },
];

const ProductPage = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDetails = () => {
        setSelectedProduct(null);
    };

    return (
        <div>
            <h1>Productos</h1>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                        <img src={product.img} alt={product.title} className="product-img" />
                        <h3>{product.title}</h3>
                        <p>${product.price.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <div className="product-detail">
                    <span className="close-detail" onClick={handleCloseDetails}>&times;</span>
                    <img src={selectedProduct.img} alt={selectedProduct.title} className="detail-img" />
                    <h3>{selectedProduct.title}</h3>
                    <p>{selectedProduct.description}</p>
                    <p>${selectedProduct.price.toLocaleString()}</p>
                    <button className="btn-cart">Añadir al carrito</button>
                </div>
            )}
        </div>
    );
};

export default products;
