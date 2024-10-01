import React, { useState } from 'react';

const ProductDetail = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        onAddToCart({ ...product, quantity });
    };

    return (
        <div className="product-detail">
            <img src={product.img} alt={product.title} />
            <h2>{product.title}</h2>
            <p>Precio: ${product.price.toLocaleString()}</p>
            <label>Cantidad:</label>
            <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(e.target.value)} />
            <button onClick={handleAddToCart}>Añadir al carrito</button>
        </div>
    );
};

export default ProductDetail;
