import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import ScrollToTop from './components/ScrollToTop'; // Mantén solo esta línea
import AmorAmistad from "./pages.clientes/amor_amistad";
import Aniversario from "./pages.clientes/aniversario";
import Anturios from "./pages.clientes/anturios";
import Boda from "./pages.clientes/boda";
import Car from "./pages.clientes/carro";
import Chirosas from "./pages.clientes/chirosas";
import PurchasePage from "./pages.clientes/compra";
import Condolencias from "./pages.clientes/condolencias";
import Cumpleaños from "./pages.clientes/cumpleaños";
import DetalleProducto from "./pages.clientes/detalleprod";
import DiaMadre from "./pages.clientes/dia_madre";
import DiaMujer from "./pages.clientes/dia_mujer";
import Eventos from "./pages.clientes/eventos";
import Gerberas from "./pages.clientes/Gerberas";
import Girasoles from "./pages.clientes/girasoles";
import Graduacion from "./pages.clientes/graduacion";
import OrderHistory from "./pages.clientes/historial";
import ResetPasswordForm from "./pages.clientes/ingresarNuevaContrase";
import RequestPasswordReset from "./pages.clientes/introducirCorreo";
import Lirios from "./pages.clientes/lirios";
import Login from "./pages.clientes/login";
import Main from "./pages.clientes/main";
import Myaccount from "./pages.clientes/micuenta";
import PaymentMethod from "./pages.clientes/pago";
import Politica from './pages.clientes/PolityPrivacity';
import QuienesSomos from "./pages.clientes/quienes_somos";
import Register from "./pages.clientes/register";
import Rosas from "./pages.clientes/rosas";
import Terminos from './pages.clientes/TerminsAndConditions';
import Admin from "./pages/admin";
import Domiciliary from "./pages/domiciliario";
import ProtectedRoute from './pages/ProtectedRoute';
import VendorDashboard from "./pages/vendedor";


function App() {
  const [cart, setCart] = useState([]);

  // Función para añadir productos al carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <AuthProvider>
      <div className="App">
        <main>
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/OrderHistory" element={<OrderHistory />} />
            <Route path="/purchase-page" element={<PurchasePage />} />
            <Route path="/payment-method" element={<PaymentMethod />} />
            <Route path="/car" element={<Car cart={cart} />} />
            <Route path="/producto/:id" element={<DetalleProducto addToCart={addToCart} />} />

            {/* Rutas adicionales */}
            <Route path="/diamujer" element={<DiaMujer addToCart={addToCart} />} />
            <Route path="/diamadre" element={<DiaMadre addToCart={addToCart} />} />
            <Route path="/AmorAmistad" element={<AmorAmistad addToCart={addToCart} />} />
            <Route path="/aniversario" element={<Aniversario addToCart={addToCart} />} />
            <Route path="/condolencias" element={<Condolencias addToCart={addToCart} />} />
            <Route path="/Cumpleaños" element={<Cumpleaños addToCart={addToCart} />} />
            <Route path="/anturios" element={<Anturios addToCart={addToCart} />} />
            <Route path="/chirosas" element={<Chirosas addToCart={addToCart} />} />
            <Route path="/gerberas" element={<Gerberas addToCart={addToCart} />} />
            <Route path="/girasoles" element={<Girasoles addToCart={addToCart} />} />
            <Route path="/lirios" element={<Lirios addToCart={addToCart} />} />
            <Route path="/rosas" element={<Rosas addToCart={addToCart} />} />
            <Route path="/graduacion" element={<Graduacion addToCart={addToCart} />} />
            <Route path="/boda" element={<Boda addToCart={addToCart} />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/quienessomos" element={<QuienesSomos />} />
            <Route path="/myaccount" element={<Myaccount />} />
            <Route path="/Terminos" element={<Terminos />} />
            <Route path="/Politica" element={<Politica />} />
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />


            {/* Rutas protegidas */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['Administrador']}><Admin /></ProtectedRoute>} />
            <Route path="/VendorDashboard" element={<ProtectedRoute allowedRoles={['Vendedor']}><VendorDashboard /></ProtectedRoute>} />
            <Route path="/domiciliary" element={<ProtectedRoute allowedRoles={['Domiciliario']}><Domiciliary /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>

  );
}

export default App;
