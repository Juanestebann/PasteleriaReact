import { Link, NavLink } from 'react-router'

function Encabezado({
    usuario = null,
    cantidadCarrito = 0,
    onCerrarSesion = () => { }
}) {
    // J14: identificar usuarios con acceso al panel administrativo
    const esPersonalInterno =
        usuario?.tipoUsuario === 'Administrador' ||
        usuario?.tipoUsuario === 'Vendedor'

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
                    {/* NavLink marca con la clase "active" la página en la que estás */}
                    <NavLink to="/" end>Inicio</NavLink>
                    <NavLink to="/productos">Carta</NavLink>
                    <Link to="/#promocion">Promociones</Link>
                    <NavLink to="/blogs">Blogs</NavLink>
                    <NavLink to="/nosotros">Nosotros</NavLink>
                    <NavLink to="/contacto">Contacto</NavLink>
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
                            {/* Lupa dibujada con SVG (el emoji se veía distinto en cada sistema) */}
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                            </svg>
                        </button>
                    </section>

                    {/* CARRITO */}
                    <Link
                        className="boton-icono"
                        to="/carrito"
                        aria-label={`Ver carrito, ${cantidadCarrito} productos`}
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                            <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="20" r="1.6" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.6" fill="currentColor" />
                        </svg>
                        <span className="contador-carrito">{cantidadCarrito}</span>
                    </Link>
                </section>

                {/* ESTADO DE SESIÓN */}
                <section id="sesion-header">
                    {usuario ? (
                        <>
                            {/* Saludo en una cápsula con la inicial del usuario */}
                            <span className="nombre-usuario">
                                <span className="avatar-sesion" aria-hidden="true">
                                    {usuario.nombre?.[0]?.toUpperCase() ?? '?'}
                                </span>
                                Hola, {usuario.nombre}
                            </span>

                            {/* J14: enlace exclusivo para personal interno */}
                            {esPersonalInterno && (
                                <Link
                                    className="boton-sesion boton-panel"
                                    to="/admin"
                                    aria-label="Ir al panel administrativo"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Panel
                                </Link>
                            )}

                            <button
                                type="button"
                                className="boton-sesion boton-salir"
                                onClick={onCerrarSesion}
                                aria-label="Cerrar sesión"
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M10 17l-5-5 5-5M5 12h11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Salir
                            </button>
                        </>
                    ) : (
                        <Link
                            className="boton-IniciarSesion"
                            to="/login"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </section>
            </header>
        </>
    )
}

export default Encabezado