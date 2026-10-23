
import { Link } from 'react-router'


import TarjetaProducto from '../../componentes/moleculas/TarjetaProducto'
import { leerProductos } from '../../utils/productos'

function Inicio({ productos }) {
    const productosDestacados = (productos ?? leerProductos()).slice(0, 8)
    return (
        <>
            {/* SECCIÓN PRINCIPAL */}
            <section id="principal">
                <article id="principal-texto">
                    <p className="texto-dorado">
                        Café, momentos y dulzura
                    </p>

                    <h2>
                        Disfruta lo mejor de nuestra pastelería
                    </h2>

                    <p>
                        Donde la tradición se transforma en
                        momentos dulces e inolvidables.
                    </p>

                    <section id="botones-principal">
                        <Link className="boton-dorado" to="/productos">
                            Ver carta
                        </Link>
                    </section>
                </article>
            </section>
            {/* BENEFICIOS */}
            <section id="beneficios">
                <article className="beneficio">
                    <h3>🎂 Repostería artesanal</h3>
                    <p>
                        Hecha cada día con ingredientes naturales.
                    </p>
                </article>

                <article className="beneficio">
                    <h3>📦 Pide por WhatsApp</h3>
                    <p>
                        Haz tu pedido fácil y rápido desde tu celular.
                    </p>
                </article>
                {/* BENEFICIO 3: VISÍTANOS */}
                <article className="beneficio">
                    <h3>📍 Visítanos</h3>
                    <p>
                        Contamos con varias sucursales para ti.
                    </p>
                </article>
            </section>

            {/* CATÁLOGO */}
            <section id="catalogo">
                <h2>Explora nuestra carta</h2>

                {/* PRODUCTOS DESTACADOS */}
                <section id="productos">
                    {productosDestacados.map((producto) => (
                        <TarjetaProducto key={producto.codigo} producto={producto} />
                    ))}
                </section>

                {/* VER TODOS LOS PRODUCTOS */}
                <section id="ver-todos-productos">
                    <Link
                        className="boton-dorado boton-ver-todos"
                        to="/productos"
                    >
                        Ver todos los productos
                    </Link>
                </section>
            </section>

            {/* NOVEDADES Y PROMOCIONES */}
            <section id="novedades">

                {/* PROMOCIÓN */}
                <article id="promocion">

                    <h3>Promoción destacada</h3>

                    <h2>50 Aniversario</h2>

                    <p>
                        Regístrate con el código{' '}
                        <b>FELICES50</b>
                        {' '}y recibe beneficios especiales.
                    </p>

                    <Link
                        className="boton-dorado"
                        to="/registro"
                    >
                        Registrarme
                    </Link>

                </article>

            </section>


        </>
    )
}

export default Inicio
