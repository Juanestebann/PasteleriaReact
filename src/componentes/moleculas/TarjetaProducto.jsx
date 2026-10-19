
import { Link } from 'react-router'

function TarjetaProducto({ producto, onAgregar }) {
    const {
        codigo,
        nombre,
        precio,
        imagen,
        stock
    } = producto

    const precioFormateado = new Intl.NumberFormat(
        'es-CL',
        {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }
    ).format(precio)

    const sinStock = stock <= 0

    function manejarAgregar() {
        if (typeof onAgregar === 'function' && !sinStock) {
            onAgregar(producto)
        }
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

            {typeof onAgregar === 'function' && (
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
