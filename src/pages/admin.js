import React, { useState } from 'react';
import '../index.css'; // Asegúrate de ajustar la ruta a tu archivo CSS
import Header from '../components/Header';
import Footer from '../components/Footer';

function App() {
    const [activeSection, setActiveSection] = useState(null);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="App">
            <Header />

            <div className="admi1">
                <div className="admi2">
                    <h1 className="welcome-title">¡Bienvenido Administrador!</h1>
                    <p className="welcome-text">Utilice el menú de navegación para gestionar los usuarios, productos, pedidos, envíos y reportes.</p>
                </div>
                <div className="nav-buttons">
                    <button className="admi40" onClick={() => handleSectionChange('usuarios')}>Usuarios</button>
                    <button className="admi40" onClick={() => handleSectionChange('productos')}>Productos</button>
                    <button className="admi40" onClick={() => handleSectionChange('pedidos')}>Pedidos</button>
                    <button className="admi40" onClick={() => handleSectionChange('envios')}>Envíos</button>
                    <button className="admi40" onClick={() => handleSectionChange('reportes')}>Reportes</button>
                </div>

                {activeSection === 'usuarios' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Usuarios</h2>
                            <input type="text" id="search-usuarios" className="admi8" placeholder="Buscar usuario..." />
                        </div>
                        <button className="admi4" onClick={() => alert('Agregar nuevo usuario')}>Agregar Usuario</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Celular</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="usuarios-body">
                                <tr>
                                    <td>1</td>
                                    <td>Juan</td>
                                    <td>Pérez</td>
                                    <td>3001234567</td>
                                    <td>juan.perez@example.com</td>
                                    <td>Administrador</td>
                                    <td>Activo</td>
                                    <td>
                                        <button className="admi6" onClick={() => alert('Editar usuario con ID: 1')}>Editar</button>
                                        <button className="admi6" onClick={() => alert('Cambiar estado de usuario con ID: 1')}>Estado</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'productos' && (
                    <div className="admi3">
                        <div className="admi9">
                            <h2>Productos</h2>
                            <input type="text" id="search-productos" className="admi8" placeholder="Buscar producto..." />
                        </div>
                        <button className="admi4" onClick={() => alert('Agregar nuevo producto')}>Agregar Producto</button>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="productos-body">
                                <tr>
                                    <td>1</td>
                                    <td>Rosa Roja</td>
                                    <td>Rosa de color rojo</td>
                                    <td>$25.00</td>
                                    <td>Disponible</td>
                                    <td>
                                        <button className="admi6" onClick={() => alert('Editar producto con ID: 1')}>Editar</button>
                                        <button className="admi6" onClick={() => alert('Cambiar estado de producto con ID: 1')}>Estado</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'pedidos' && (
                    <div className="admi3">
                        <h2>Pedidos</h2>
                        <div className="search-container">
                            <input type="text" id="search-pedidos" className="admi8" placeholder="Buscar pedido..." />
                        </div>
                        <div className="button-container">
                            <button className="admi4" onClick={() => alert('Agregar nuevo pedido')}>Agregar Pedido</button>
                        </div>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="pedidos-body">
                                <tr>
                                    <td>101</td>
                                    <td>2024-09-01</td>
                                    <td>María Gómez</td>
                                    <td>$50.00</td>
                                    <td>Pendiente</td>
                                    <td>
                                        <button className="admi6">Ver Detalles</button>
                                        <button className="admi6">Actualizar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'envios' && (
                    <div className="admi3">
                        <h2>Envíos</h2>
                        <div className="search-container">
                            <input type="text" id="search-envios" className="admi8" placeholder="Buscar envío..." />
                        </div>
                        <div className="button-container">
                            <button className="admi4" onClick={() => alert('Agregar nuevo envío')}>Agregar Envío</button>
                        </div>
                        <table className="admi5">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pedido</th>
                                    <th>Dirección</th>
                                    <th>Fecha de Envío</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="envios-body">
                                <tr>
                                    <td>501</td>
                                    <td>101</td>
                                    <td>Calle 123</td>
                                    <td>2024-09-02</td>
                                    <td>Enviado</td>
                                    <td>
                                        <button className="admi6">Ver Detalles</button>
                                        <button className="admi6">Actualizar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'reportes' && (
                    <div className="admi3">
                        <h2>Reportes</h2>
                        <button className="admi4" onClick={() => alert('Generar nuevo reporte')}>Generar Reporte</button>
                        <div className="report-separator"></div>
                        <div className="report-content">
                            <h3>Reporte de Ventas del Mes</h3>
                            <p>Ventas Totales: $5000</p>
                            <p>Pedidos Totales: 50</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default App;
