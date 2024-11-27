import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Footer from '../components/Footer';
import Header from '../components/Header';
import Headerc from '../components/Header.c';

function TerminsAndConditions() {
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
            <div className='terminos bg-white p-8 rounded-lg shadow-lg'>
                <h1 className='text-center text-3xl pb-8'>Términos y Condiciones</h1>
                
                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>1. Aceptación de los Términos:</h2>
                    <p>
                        Al acceder y utilizar el sistema de información de ventas en línea de la Distribuidora de
                        Flores Yesid, usted acepta estar sujeto a los términos y condiciones aquí descritos. Si no está
                        de acuerdo con estos términos, no debe utilizar el sistema.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>2. Definiciones:</h2>
                    <ul className='list-disc list-inside'>
                        <li><strong>"Sistema"</strong> se refiere al sistema de información de ventas en línea proporcionado por la Distribuidora de Flores Yesid.</li>
                        <li><strong>"Usuario"</strong> se refiere a cualquier persona que accede y utiliza el sistema.</li>
                        <li><strong>"Cliente"</strong> se refiere a cualquier entidad que realiza compras a través del sistema.</li>
                    </ul>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>3. Uso del Sistema:</h2>
                    <p>
                        El Usuario acepta utilizar el sistema de manera responsable y únicamente para los fines
                        permitidos por estos términos. El Usuario no utilizará el sistema para actividades ilegales o
                        no autorizadas.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>4. Registro y Cuenta:</h2>
                    <p>
                        Para utilizar ciertas funciones del sistema, es posible que el Usuario deba registrarse y crear
                        una cuenta. El Usuario es responsable de mantener la confidencialidad de su información de
                        inicio de sesión y de todas las actividades que ocurran bajo su cuenta.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>5. Privacidad:</h2>
                    <p>
                        La Distribuidora de Flores Yesid respeta la privacidad de sus usuarios. La información
                        personal recopilada a través del sistema se manejará de acuerdo con nuestra Política de
                        Privacidad, la cual está disponible en{' '}
                        <Link to="/Politica" className="text-blue-400 hover:underline">
                            enlace a la política de privacidad
                        </Link>.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>6. Precios y Pagos:</h2>
                    <p>
                        Los precios de los productos y servicios están sujetos a cambios sin previo aviso. Todas las
                        compras realizadas a través del sistema están sujetas a la política de precios vigente en el
                        momento de la compra.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>7. Propiedad Intelectual:</h2>
                    <p>
                        Todo el contenido del sistema, incluidos, pero no limitados a textos, gráficos, logotipos, y
                        software, es propiedad de la Distribuidora de Flores Yesid o de sus proveedores y está
                        protegido por las leyes de derechos de autor y otras leyes de propiedad intelectual.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>8. Limitación de Responsabilidad:</h2>
                    <p>
                        La Distribuidora de Flores Yesid no será responsable por daños directos, indirectos,
                        incidentales, especiales, o consecuentes que resulten del uso o la imposibilidad de uso del
                        sistema.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>9. Modificaciones a los Términos:</h2>
                    <p>
                        La Distribuidora de Flores Yesid se reserva el derecho de modificar estos Términos y
                        Condiciones en cualquier momento. Las modificaciones serán efectivas inmediatamente
                        después de su publicación en el sistema.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>10. Ley Aplicable:</h2>
                    <p>
                        Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de
                        Colombia-Bogotá, sin dar efecto a sus conflictos de disposiciones legales.
                    </p>
                </section>

                <section className='pb-4'>
                    <h2 className='text-xl font-semibold'>11. Contacto:</h2>
                    <p>
                        Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos en
                        <a href="mailto:mary.luzgomez@hotmail.com" className="text-blue-400 hover:underline">
                            mary.luzgomez@hotmail.com
                        </a>.
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default TerminsAndConditions;
