import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../static/img/Logo.png';
import '../index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
    const [isAccountOpen, setAccountOpen] = useState(false);
    const [isSpecialDatesOpen, setSpecialDatesOpen] = useState(false);
    const accountRef = useRef(null);
    const specialDatesRef = useRef(null);

    const toggleAccountDropdown = () => {
        setAccountOpen(!isAccountOpen);
        setSpecialDatesOpen(false);
    };

    const toggleSpecialDatesDropdown = () => {
        setSpecialDatesOpen(!isSpecialDatesOpen);
        setAccountOpen(false);
    };

    const closeAllDropdowns = () => {
        setAccountOpen(false);
        setSpecialDatesOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (accountRef.current && accountRef.current.contains(event.target)) ||
                (specialDatesRef.current && specialDatesRef.current.contains(event.target))
            ){
                return;
            }
            closeAllDropdowns();
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="top-bar">
                <div className="logo">
                <Link to="/"><img src={logo} alt="Distribuidora de Flores Yesid" />
                </Link>
                <p>Distribuidora de Flores Yesid</p>
                </div>
                <div className="account-cart">
                    <div className="cart">
                        <button type="button"><i className="fas fa-shopping-cart"></i> 0 ARTÍCULO(S) - $0</button>
                    </div>
                    <div className="account" ref={accountRef} onClick={toggleAccountDropdown}>
                        <i className="fas fa-user"></i> MI CUENTA
                        <div className={`dropdown ${isAccountOpen ? 'active' : ''}`}>
                            <Link to="/register">Registrarse <i className="fa fa-unlock-alt" aria-hidden="true"></i></Link>
                            <Link to="/login">Acceder <i className="fa fa-user" aria-hidden="true"></i></Link>
                            <Link to="/orderhistory">Historial <i className="fa fa-user" aria-hidden="true"></i></Link>
                            <Link to="/purchasepage">Compra <i className="fa fa-user" aria-hidden="true"></i></Link>

                        </div>
                    </div>
                </div>
            </div>
            <nav className="main-menu">
                <ul>
                    <li className="special-dates" ref={specialDatesRef}>
                        <Link to="#" className="toggle-special-dates" onClick={toggleSpecialDatesDropdown}>
                            FECHAS ESPECIALES <i className="fa fa-bars" aria-hidden="true"></i>
                        </Link>
                        <ul className={`dropdown special-dates-dropdown ${isSpecialDatesOpen ? 'active' : ''}`}>
                            <li><Link to="#"><i className="fa fa-female" aria-hidden="true"></i> Día de la Mujer</Link></li>
                            <li><Link to="#"><i className="fa fa-heart" aria-hidden="true"></i> Día de la Madre</Link></li>
                            <li><Link to="#"><i className="fa fa-cake-candles" aria-hidden="true"></i> Aniversario</Link></li>
                            <li><Link to="#"><i className="fa fa-heart" aria-hidden="true"></i> Amor y Amistad</Link></li>
                            <li><Link to="/cumpleaños"><i className="fa fa-birthday-cake" aria-hidden="true"></i> Cumpleaños</Link></li>
                            <li><Link to="#"><i className="fa fa-sad-tear" aria-hidden="true"></i> Condolencias</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="#">FLORES <i className="fa fa-chevron-down"></i></Link>
                        <div className="dropdown flower-submenu">
                            <div className="menu-column">
                                <Link to="#" className="parent">Naturales</Link>
                                <ul className="column category">
                                    <li><Link to="#">Rosas</Link></li>
                                    <li><Link to="#">Tulipanes</Link></li>
                                    <li><Link to="#">Lirios</Link></li>
                                </ul>
                            </div>
                            <div className="menu-column">
                                <Link to="#" className="parent">Naturales 2</Link>
                                <ul className="column category">
                                    <li><Link to="#">Orquídeas</Link></li>
                                    <li><Link to="#">Margaritas</Link></li>
                                    <li><Link to="#">Claveles</Link></li>
                                </ul>
                            </div>
                            <div className="menu-column">
                                <Link to="#" className="parent">Categoría 3</Link>
                                <ul className="column category">
                                    <li><Link to="#">Producto 1</Link></li>
                                    <li><Link to="#">Producto 2</Link></li>
                                    <li><Link to="#">Producto 3</Link></li>
                                </ul>
                            </div>
                            <div className="menu-column">
                                <Link to="#" className="parent">Categoría 4</Link>
                                <ul className="column category">
                                    <li><Link to="#">Producto A</Link></li>
                                    <li><Link to="#">Producto B</Link></li>
                                    <li><Link to="#">Producto C</Link></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <Link to="#">EVENTOS <i className="fa fa-angle-down"></i></Link>
                        <ul className="dropdown">
                            <li className="dropdown-item"><Link to="#">Eventos</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="#">QUIÉNES SOMOS <i className="fa fa-angle-down"></i></Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
