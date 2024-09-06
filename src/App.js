import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./pages.clientes/main";
import Login from "./pages.clientes/login";
import Register from "./pages.clientes/register";
import OrderHistory from "./pages.clientes/historial";
import PurchasePage from "./pages.clientes/compra";
import PaymentMethod from "./pages.clientes/pago";
import VendorDashboard from "./pages/vendedor";
import Domiciliary from "./pages/domiciliario"


function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/PurchasePage" element={<PurchasePage />} />
          <Route path="/PaymentMethod" element={<PaymentMethod />} />
          <Route path="/VendorDashboard" element={<VendorDashboard />} />
          <Route path="/Domiciliary" element={<Domiciliary />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;