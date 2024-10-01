import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import Headerc from '../components/Header.c';
import Footer from '../components/Footer';
import { jwtDecode } from 'jwt-decode';


function TerminsAndConditions() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsAuthenticated(!!decoded.rol); // Verifica si hay un rol
            } catch (e) {
                console.error('Error decodificando el token', e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    return (
        <div className='terminos pt-12 px-[10%] font-serif'>
            {isAuthenticated ? <Headerc /> : <Header />}
            <h1 className='text-center text-3xl pb-8'>Términos y Condiciones</h1>

            1. Aceptación de los Términos:
            Al acceder y utilizar el sistema de información de ventas en línea de la Distribuidora de
            Flores Yesid, usted acepta estar sujeto a los términos y condiciones aquí descritos. Si no está
            de acuerdo con estos términos, no debe utilizar el sistema. <br /> <br />
            2. Definiciones:
            - &quot;Sistema&quot; se refiere al sistema de información de ventas en línea proporcionado por la
            Distribuidora de Flores Yesid.
            - &quot;Usuario&quot; se refiere a cualquier persona que accede y utiliza el sistema.
            - &quot;Cliente&quot; se refiere a cualquier entidad que realiza compras a través del sistema. <br /> <br />
            3. Uso del Sistema:
            El Usuario acepta utilizar el sistema de manera responsable y únicamente para los fines
            permitidos por estos términos. El Usuario no utilizará el sistema para actividades ilegales o
            no autorizadas. <br /> <br />
            4. Registro y Cuenta:
            Para utilizar ciertas funciones del sistema, es posible que el Usuario deba registrarse y crear
            una cuenta. El Usuario es responsable de mantener la confidencialidad de su información de
            inicio de sesión y de todas las actividades que ocurran bajo su cuenta. <br /> <br />
            5. Privacidad:
            La Distribuidora de Flores Yesid respeta la privacidad de sus usuarios. La información
            personal recopilada a través del sistema se manejará de acuerdo con nuestra Política de
            Privacidad, la cual está disponible en{' '}
            <Link to="/Politica" className="text-blue-400 hover:underline">
                enlace a la política de privacidad
            </Link> <br /> <br />
            6. Precios y Pagos:

            Los precios de los productos y servicios están sujetos a cambios sin previo aviso. Todas las
            compras realizadas a través del sistema están sujetas a la política de precios vigente en el
            momento de la compra. <br /> <br />
            7. Propiedad Intelectual:
            Todo el contenido del sistema, incluidos, pero no limitados a textos, gráficos, logotipos, y
            software, es propiedad de la Distribuidora de Flores Yesid o de sus proveedores y está
            protegido por las leyes de derechos de autor y otras leyes de propiedad intelectual. <br /> <br />
            8. Limitación de Responsabilidad
            La Distribuidora de Flores Yesid no será responsable por daños directos, indirectos,
            incidentales, especiales, o consecuentes que resulten del uso o la imposibilidad de uso del
            sistema. <br /> <br />
            9. Modificaciones a los Términos:
            La Distribuidora de Flores Yesid se reserva el derecho de modificar estos Términos y
            Condiciones en cualquier momento. Las modificaciones serán efectivas inmediatamente
            después de su publicación en el sistema. <br /> <br />
            10. Ley Aplicable:
            Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de
            Colombia-Bogotá, sin dar efecto a sus conflictos de disposiciones legales. <br /> <br />
            11. Contacto:
            Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en
            mary.luzgomez@hotmail.com <br /><br />

            <Footer />

        </div>
    )
}

export default TerminsAndConditions
