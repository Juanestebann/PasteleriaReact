
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { agregarProducto } from '../../utils/carrito'
import { leerCarrito, guardarCarrito } from '../../utils/almacenamiento'
import { productosIniciales } from '../../datos/productos'

function DetalleProducto({ productos = productosIniciales }) {
    const { codigo } = useParams()
    const [cantidad, setCantidad] = useState(1)
    const [mensajeCarrito, setMensajeCarrito] = useState('')

    const producto = productos.find(
        item => item.codigo === codigo
    )

    function manejarAgregarCarrito() {
        if (!producto || cantidadMaxima === 0) return
        const carritoActual = leerCarrito()
        const carritoNuevo = agregarProducto(carritoActual, producto, Math.min(cantidad, cantidadMaxima))
        if (carritoNuevo === carritoActual) {
            setMensajeCarrito('No se puede agregar esa cantidad: verifica el stock disponible en tu carrito.')
            return
        }
        if (guardarCarrito(carritoNuevo)) {
            setMensajeCarrito('Producto añadido al carrito correctamente.')
        } else {
            setMensajeCarrito('No se pudo guardar el carrito. Inténtalo nuevamente.')
        }
    }

    if (!producto) {
        return (
            <main id="detalle-contenedor">
                <h2>Producto no encontrado</h2>
                <p>No se encontró información del producto.</p>
                <Link to="/productos">
                    Volver al catálogo
                </Link>
            </main>
        )
    }

    const precioFormateado =
        '$' + producto.precio.toLocaleString('es-CL') + ' CLP'

    const cantidadMaxima = Math.min(
        10,
        Math.max(0, producto.stock)
    )

    const productosRelacionados = [
        ...productosIniciales.filter(
            item =>
                item.codigo !== producto.codigo &&
                item.categoria === producto.categoria
        ),
        ...productosIniciales.filter(
            item =>
                item.codigo !== producto.codigo &&
                item.categoria !== producto.categoria
        )
    ].slice(0, 4)

    return (
        <main>
            <section id="detalle-contenedor">

                {/* RUTA DE NAVEGACIÓN */}
                <nav
                    id="ruta-producto"
                    aria-label="Ruta del producto"
                >
                    <Link to="/">Inicio</Link>
                    <span>&gt;</span>
                    <Link to="/productos">Productos</Link>
                    <span>&gt;</span>
                    <span id="ruta-nombre">
                        {producto.nombre}
                    </span>
                </nav>

                {/* DETALLE PRINCIPAL */}
                <section id="detalle-producto">

                    {/* IMAGEN */}
                    <article id="galeria-producto">
                        <section id="imagen-grande">
                            <img
                                id="imagen-producto"
                                src={producto.imagen}
                                alt={producto.nombre}
                            />
                        </section>
                    </article>

                    {/* INFORMACIÓN */}
                    <article id="informacion-producto">

                        <section id="cabecera-producto">
                            <h2 id="nombre-producto">
                                {producto.nombre}
                            </h2>

                            <p id="precio-producto">
                                {precioFormateado}
                            </p>
                        </section>

                        <section id="descripcion-producto-contenedor">
                            <p id="descripcion-producto">
                                {producto.descripcion}
                            </p>
                        </section>

                        <section id="cantidad-producto">
                            <label htmlFor="cantidad">
                                Cantidad
                            </label>

                            <select
                                id="cantidad"
                                value={Math.min(cantidad, cantidadMaxima) || 1}
                                onChange={evento =>
                                    setCantidad(Number(evento.target.value))
                                }
                                disabled={cantidadMaxima === 0}
                            >
                                {Array.from(
                                    { length: cantidadMaxima },
                                    (_, indice) => indice + 1
                                ).map(numero => (
                                    <option
                                        key={numero}
                                        value={numero}
                                    >
                                        {numero}
                                    </option>
                                ))}
                            </select>
                        </section>

                        <button
                            id="agregar-carrito"
                            className="btn btn-compra"
                            type="button"
                            onClick={manejarAgregarCarrito}
                            disabled={cantidadMaxima === 0}
                        >
                            Añadir al carrito
                        </button>

                        <p
                            id="mensaje-carrito"
                            role="status"
                        >
                            {cantidadMaxima === 0
                                ? 'Producto sin stock.'
                                : mensajeCarrito}
                        </p>

                        <section id="linea-final"></section>
                    </article>
                </section>

                {/* PRODUCTOS RELACIONADOS */}
                <section id="productos-relacionados-contenedor">
                    <h3>Podrían Gustarte</h3>

                    <section
                        id="productos-relacionados"
                        aria-label="Productos relacionados"
                    >
                        {productosRelacionados.map(relacionado => (
                            <Link
                                key={relacionado.codigo}
                                to={`/producto/${relacionado.codigo}`}
                                aria-label={`Ver ${relacionado.nombre}`}
                            >
                                <img
                                    src={relacionado.imagen}
                                    alt={relacionado.nombre}
                                    loading="lazy"
                                />
                            </Link>
                        ))}
                    </section>
                </section>

            </section>
        </main>
    )
}

export default DetalleProducto
