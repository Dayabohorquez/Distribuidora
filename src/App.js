import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import AmorAmistad from "./pages.clientes/amor_amistad";
import Aniversario from "./pages.clientes/aniversario";
import Anturios from "./pages.clientes/anturios";
import Chirosas from "./pages.clientes/chirosas";
import PurchasePage from "./pages.clientes/compra";
import Condolencias from "./pages.clientes/condolencias";
import Cumpleaños from "./pages.clientes/cumpleaños";
import DiaMadre from "./pages.clientes/dia_madre";
import DiaMujer from "./pages.clientes/dia_mujer";
import Eventos from "./pages.clientes/eventos";
import Gerberas from "./pages.clientes/Gerberas";
import Girasoles from "./pages.clientes/girasoles";
import OrderHistory from "./pages.clientes/historial";
import Lirios from "./pages.clientes/lirios";
import Login from "./pages.clientes/login";
import Main from "./pages.clientes/main";
import PaymentMethod from "./pages.clientes/pago";
import QuienesSomos from "./pages.clientes/quienes_somos";
import Register from "./pages.clientes/register";
import Rosas from "./pages.clientes/rosas";
import Domiciliary from "./pages/domiciliario";
import VendorDashboard from "./pages/vendedor";
import Admin from "./pages/admin";
import Myaccount from "./pages.clientes/micuenta";
import Car from "./pages.clientes/carro";
import DetalleProducto from "./pages.clientes/detalleprod";
import ProtectedRoute from './pages/ProtectedRoute'; // Asegúrate de que esta ruta sea correcta
import Terminos from './pages.clientes/TerminsAndConditions';
import Politica from './pages.clientes/PolityPrivacity';

function App() {
  const [cart, setCart] = useState([]);

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    // Aquí puedes añadir lógica de notificación si lo deseas
    alert('Producto añadido al carrito.');
  };

  return (
    <div className="App">
      <main>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/purchase-page" element={<PurchasePage />} />
          <Route path="/payment-method" element={<PaymentMethod />} />
          <Route path="/car" element={<Car cart={cart} />} /> {/* Asegúrate de pasar el carrito si lo necesitas */}
          <Route path="/producto/:id" element={<DetalleProducto addToCart={addToCart} />} />

          {/* Rutas adicionales */}
          <Route path="/diamujer" element={<DiaMujer />} />
          <Route path="/diamadre" element={<DiaMadre />} />
          <Route path="/AmorAmistad" element={<AmorAmistad />} />
          <Route path="/aniversario" element={<Aniversario />} />
          <Route path="/condolencias" element={<Condolencias />} />
          <Route path="/cumpleanos" element={<Cumpleaños />} />
          <Route path="/anturios" element={<Anturios />} />
          <Route path="/chirosas" element={<Chirosas />} />
          <Route path="/gerberas" element={<Gerberas />} />
          <Route path="/girasoles" element={<Girasoles />} />
          <Route path="/lirios" element={<Lirios />} />
          <Route path="/rosas" element={<Rosas />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/quienessomos" element={<QuienesSomos />} />
          <Route path="/myaccount" element={<Myaccount />} />
          <Route path="/Terminos" element={<Terminos />} />
          <Route path="/Politica" element={<Politica />} />

          {/* Rutas protegidas */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Administrador']}><Admin /></ProtectedRoute>} />
          <Route path="/VendorDashboard" element={<ProtectedRoute allowedRoles={['Vendedor']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/domiciliary" element={<ProtectedRoute allowedRoles={['Domiciliario']}><Domiciliary /></ProtectedRoute>} />

          {/* Ruta para redirigir a la página principal si no se encuentra ninguna ruta */}
          <Route path="*" element={<Main />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
