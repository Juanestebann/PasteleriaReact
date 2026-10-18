
import { Link } from 'react-router'

function Encabezado({
    usuario = null,
    cantidadCarrito = 0,
    onCerrarSesion = () => { }
}) {
    return (
        <>
            {/* BARRA SUPERIOR */}
            <section id="barra-superior">
                <p>📍 Av. San Martín 1234, Concepción</p>
                <p>◷ Lun - Dom: 08:00 - 20:00</p>
                <p>Síguenos en: Instagram</p>
            </section>

            {/* ENCABEZADO */}
            <header>
                {/* MARCA */}
                <section id="marca">
                    <h1>Pastelería Mil Sabores</h1>
                    <p>Cafetería & Pastelería</p>
                </section>

                {/* NAVEGACIÓN */}
                <nav id="menu" aria-label="Navegación principal">
                    <Link to="/">Inicio</Link>
                    <Link to="/productos">Carta</Link>
                    <Link to="/#promocion">Promociones</Link>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/nosotros">Nosotros</Link>
                    <Link to="/contacto">Contacto</Link>
                </nav>
                {/* ACCIONES DEL ENCABEZADO */}
                <section id="acciones-header">

                    {/* BUSCADOR */}
                    <section id="buscador">
                        <input
                            type="search"
                            id="buscar-producto"
                            placeholder="Buscar producto..."
                            aria-label="Buscar producto"
                        />

                        <button type="button" aria-label="Buscar">
                            🔍
                        </button>
                    </section>

                    {/* CARRITO */}
                    <Link
                        className="boton-icono"
                        to="/carrito"
                        aria-label={`Ver carrito, ${cantidadCarrito} productos`}
                    >
                        🛒 <span>{cantidadCarrito}</span>
                    </Link>

                </section>
                {/* ESTADO DE SESIÓN */}
                <section id="sesion-header">
                    {usuario ? (
                        <>
                            <span>Hola, {usuario.nombre}</span>

                            <button type="button" onClick={onCerrarSesion}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link className="boton-IniciarSesion" to="/login">
                            Iniciar Sesión
                        </Link>
                    )}
                </section>
            </header>
        </>
    )
}

export default Encabezado
