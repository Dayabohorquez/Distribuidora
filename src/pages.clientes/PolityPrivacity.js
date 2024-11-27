import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Headerc from '../components/Header.c';
import { jwtDecode } from 'jwt-decode';

function PolityPrivacity() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(!!decoded.rol); // Verifica si hay un rol
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    return (
        <div className='pt-12 px-[10%] font-serif'>
            {isAuthenticated ? <Headerc /> : <Header />}
            <h1 className='text-3xl text-center pb-8'>Política de Privacidad</h1>

            <section>
                <h2>1. Introducción:</h2>
                <p>
                    En la empresa Distribuidora de Flores Yesid, valoramos y respetamos su privacidad.
                    Esta Política de Privacidad describe cómo recopilamos, utilizamos, y protegemos su
                    información personal cuando utiliza nuestro sistema de información de ventas en línea.
                </p>

                <h2>2. Información que Recopilamos:</h2>
                <ul>
                    <li>Información Personal: nombre, dirección de correo electrónico, número de teléfono, dirección postal, información de pago, etc.</li>
                    <li>Información de Uso: detalles sobre cómo utiliza el sistema, como las páginas visitadas, el tiempo de permanencia en cada página, y otros datos de navegación.</li>
                    <li>Información Técnica: dirección IP, tipo de navegador, proveedor de servicios de internet (ISP), páginas de referencia/salida, y sistema operativo.</li>
                </ul>

                <h2>3. Uso de la Información:</h2>
                <ul>
                    <li>Procesar y gestionar sus pedidos y transacciones.</li>
                    <li>Proporcionar y mejorar nuestros productos y servicios.</li>
                    <li>Personalizar su experiencia de usuario.</li>
                    <li>Enviar comunicaciones relacionadas con su cuenta o transacciones.</li>
                    <li>Cumplir con obligaciones legales y normativas.</li>
                </ul>

                <h2>4. Compartir su Información:</h2>
                <p>No compartimos su información personal con terceros, excepto en los siguientes casos:</p>
                <ul>
                    <li>Proveedores de Servicios: Compartimos información con proveedores que nos ayudan a operar nuestro sistema y procesar transacciones.</li>
                    <li>Cumplimiento Legal: Podemos divulgar su información si es requerido por ley, o si creemos que es necesario para proteger nuestros derechos legales.</li>
                    <li>Transferencias de Negocios: En caso de una fusión, adquisición, o venta de activos, su información podría ser transferida como parte del negocio.</li>
                </ul>

                <h2>5. Seguridad de la Información:</h2>
                <p>
                    Nos comprometemos a proteger su información personal. Utilizamos medidas de seguridad técnicas,
                    administrativas, y físicas para proteger su información contra accesos no autorizados, uso indebido, y divulgación.
                </p>

                <h2>6. Cookies y Tecnologías Similares:</h2>
                <p>
                    Nuestro sistema puede utilizar cookies y otras tecnologías similares para mejorar su experiencia de usuario,
                    analizar el tráfico del sistema, y personalizar el contenido. Puede ajustar la configuración de su navegador
                    para rechazar cookies, pero esto podría afectar la funcionalidad del sistema.
                </p>

                <h2>7. Sus Derechos:</h2>
                <p>
                    Dependiendo de su jurisdicción, usted puede tener derechos relacionados con su información personal,
                    tales como el derecho a acceder, rectificar, o eliminar su información. Puede ejercer estos derechos contactándonos en
                    <a href="mailto:mary.luzgomez@hotmail.com"> mary.luzgomez@hotmail.com</a>.
                </p>

                <h2>8. Retención de la Información:</h2>
                <p>
                    Retendremos su información personal solo durante el tiempo que sea necesario para cumplir con los fines
                    descritos en esta política, o según lo exija la ley.
                </p>

                <h2>9. Cambios a esta Política de Privacidad:</h2>
                <p>
                    Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento.
                    Las modificaciones serán efectivas al momento de su publicación en el sistema.
                    Se le notificará sobre cambios importantes por correo electrónico o mediante un aviso en nuestro sistema.
                </p>

                <h2>10. Contacto:</h2>
                <p>
                    Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre nuestras prácticas de manejo
                    de la información, puede contactarnos en <a href="mailto:mary.luzgomez@hotmail.com">mary.luzgomez@hotmail.com</a>.
                </p>
            </section>

            <Footer />
        </div>
    );
}

export default PolityPrivacity;
