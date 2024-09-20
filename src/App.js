import React from "react";
import { Route, Routes } from "react-router-dom";
import AmorAmistad from "./pages.clientes/amor_amistad";
import Aniversario from "./pages.clientes/aniversario";
import Anturios from "./pages.clientes/anturios";
import Car from "./pages.clientes/carro";
import Chirosas from "./pages.clientes/chirosas";
import PurchasePage from "./pages.clientes/compra";
import Condolencias from "./pages.clientes/condolencias";
import Cumpleaños from "./pages.clientes/cumpleaños";
import Detailprod from "./pages.clientes/detalleprod";
import DiaMadre from "./pages.clientes/dia_madre";
import DiaMujer from "./pages.clientes/dia_mujer";
import Eventos from "./pages.clientes/eventos";
import Gerberas from "./pages.clientes/Gerberas";
import Girasoles from "./pages.clientes/girasoles";
import OrderHistory from "./pages.clientes/historial";
import Lirios from "./pages.clientes/lirios";
import Login from "./pages.clientes/login";
import Main from "./pages.clientes/main";
import Myaccount from "./pages.clientes/micuenta";
import PaymentMethod from "./pages.clientes/pago";
import QuienesSomos from "./pages.clientes/quienes_somos";
import Register from "./pages.clientes/register";
import Rosas from "./pages.clientes/rosas";
import Admin from "./pages/admin";
import Domiciliary from "./pages/domiciliario";
import VendorDashboard from "./pages/vendedor";


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
          <Route path="/Admin" element={<Admin />} />
          <Route path="/DiaMujer" element={<DiaMujer />} />
          <Route path="/DiaMadre" element={<DiaMadre />} />
          <Route path="/AmorAmistad" element={<AmorAmistad />} />
          <Route path="Aniversario" element={<Aniversario />} />
          <Route path="Condolencias" element={<Condolencias />} />
          <Route path="Cumpleaños" element={<Cumpleaños />} />
          <Route path="Anturios" element={<Anturios />} />
          <Route path="Chirosas" element={<Chirosas />} />
          <Route path="Gerberas" element={<Gerberas />} />
          <Route path="Girasoles" element={<Girasoles />} />
          <Route path="Lirios" element={<Lirios />} />
          <Route path="Rosas" element={<Rosas />} />
          <Route path="Eventos" element={<Eventos />} />
          <Route path="QuienesSomos" element={<QuienesSomos />} />
          <Route path="/Myaccount" element={<Myaccount />} />
          <Route path="/Car" element={<Car/>} />
          <Route path="/Detailprod" element={<Detailprod/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;