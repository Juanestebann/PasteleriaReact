
import { Link } from 'react-router'

function PiePagina() {
    return (
        <footer className="footer-publico">
            <section id="footer-contenido">

                {/* INFORMACIÓN DE LA PASTELERÍA */}
                <article className="footer-columna">
                    <h3>Pastelería Mil Sabores</h3>
                    <p>Cafetería & Pastelería</p>
                    <p>Momentos dulces para compartir.</p>
                </article>

                {/* CONTACTO */}
                <article className="footer-columna">
                    <h3>Contacto</h3>
                    <p>📍 Av. San Martín 1234, Concepción</p>
                    <p>◷ Lun - Dom: 08:00 - 20:00</p>
                    <p>contacto@milsabores.cl</p>
                </article>

                {/* ENLACES RÁPIDOS */}
                <article className="footer-columna">
                    <h3>Enlaces rápidos</h3>

                    <Link to="/">Inicio</Link>
                    <Link to="/productos">Carta</Link>
                    <Link to="/nosotros">Nosotros</Link>
                    <Link to="/contacto">Contacto</Link>

                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                </article>

            </section>

            {/* DERECHOS RESERVADOS */}
            <section id="footer-derechos">
                <p>
                    © 2026 Pastelería Mil Sabores - Todos los derechos reservados
                </p>
            </section>
        </footer>
    )
}

export default PiePagina
