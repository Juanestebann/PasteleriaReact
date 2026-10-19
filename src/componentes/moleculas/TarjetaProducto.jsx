
import { Link } from 'react-router'

function TarjetaProducto({ producto, onAgregar, variante = 'normal' }) {
    const {
        codigo,
        nombre,
        precio,
        imagen,
        stock
    } = producto

    const sinStock = stock <= 0
    const puedeAgregar = typeof onAgregar === 'function'
    const esCatalogo = variante === 'catalogo'

    const precioFormateado = '$' +
        precio.toLocaleString('es-CL') +
        (esCatalogo ? ' CLP' : '')

    function manejarAgregar() {
        if (puedeAgregar && !sinStock) {
            onAgregar(producto)
        }
    }

    if (esCatalogo) {
        return (
            <article
                className="producto-completo"
                data-categoria={producto.categoria}
                data-codigo={codigo}
            >
                <img
                    src={imagen}
                    alt={nombre}
                    loading="lazy"
                />

                <h3>{nombre}</h3>

                <p>{precioFormateado}</p>

                <section className="acciones-producto">
                    <button
                        type="button"
                        className="boton-agregar"
                        onClick={manejarAgregar}
                        disabled={!puedeAgregar || sinStock}
                        aria-label={`Agregar ${nombre} al carrito`}
                        title={
                            !puedeAgregar
                                ? 'Disponible cuando se integre el carrito'
                                : sinStock
                                    ? 'Producto sin stock'
                                    : 'Añadir al carrito'
                        }
                    >
                        Añadir
                    </button>

                    <Link to={`/producto/${codigo}`}>
                        Ver detalle
                    </Link>
                </section>
            </article>
        )
    }

    return (
        <article className="producto">
            <img
                src={imagen}
                alt={nombre}
                loading="lazy"
            />

            <h3>{nombre}</h3>

            <b>{precioFormateado}</b>

            <Link
                className="boton-producto"
                to={`/producto/${codigo}`}
            >
                Ver producto
            </Link>

            {puedeAgregar && (
                <button
                    type="button"
                    className="boton-producto"
                    onClick={manejarAgregar}
                    disabled={sinStock}
                    aria-label={`Agregar ${nombre} al carrito`}
                >
                    {sinStock ? 'Sin stock' : 'Agregar al carrito'}
                </button>
            )}
        </article>
    )
}

export default TarjetaProducto
