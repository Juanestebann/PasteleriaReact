
import { Link } from 'react-router'


const productosDestacados = [
    {
        codigo: 'TC001',
        nombre: 'Torta Cuadrada de Chocolate',
        precio: '$45.000 CLP',
        imagen: '/img/Torta Cuadrada de Chocolate.png'
    },
    {
        codigo: 'TC002',
        nombre: 'Torta Cuadrada de Frutas',
        precio: '$50.000 CLP',
        imagen: '/img/Torta Cuadrada de Frutas.png'
    },
    {
        codigo: 'TT001',
        nombre: 'Torta Circular de Vainilla',
        precio: '$40.000 CLP',
        imagen: '/img/Torta Circular de Vainilla.png'
    },
    {
        codigo: 'TT002',
        nombre: 'Torta Circular de Manjar',
        precio: '$42.000 CLP',
        imagen: '/img/Torta Circular de Manjar.png'
    },
    {
        codigo: 'PI001',
        nombre: 'Mousse de Chocolate',
        precio: '$5.000 CLP',
        imagen: '/img/Mousse de Chocolate.png'
    },
    {
        codigo: 'PI002',
        nombre: 'Tiramisú Clásico',
        precio: '$5.500 CLP',
        imagen: '/img/Tiramisú Clásico.png'
    },
    {
        codigo: 'PSA001',
        nombre: 'Torta Sin Azúcar de Naranja',
        precio: '$48.000 CLP',
        imagen: '/img/Torta Sin Azúcar de Naranja.png'
    },
    {
        codigo: 'PSA002',
        nombre: 'Cheesecake Sin Azúcar',
        precio: '$47.000 CLP',
        imagen: '/img/Cheesecake Sin Azúcar.png'
    }
]

function Inicio() {
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
                        <article className="producto" key={producto.codigo}>
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                            />

                            <h3>{producto.nombre}</h3>

                            <b>{producto.precio}</b>

                            <Link
                                className="boton-producto"
                                to={`/producto/${producto.codigo}`}
                            >
                                Ver producto
                            </Link>
                        </article>
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
