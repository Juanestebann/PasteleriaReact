
function ItemCarrito({
    producto,
    onAumentar,
    onDisminuir,
    onEliminar
}) {
    const {
        codigo,
        nombre,
        descripcion,
        precio,
        imagen,
        cantidad,
        stock
    } = producto

    const subtotal = precio * cantidad

    const precioFormateado = '$' + subtotal.toLocaleString('es-CL')

    const puedeAumentar = typeof onAumentar === 'function'
    const puedeDisminuir = typeof onDisminuir === 'function'
    const puedeEliminar = typeof onEliminar === 'function'

    const stockAlcanzado =
        Number.isInteger(stock) && cantidad >= stock

    function manejarAumentar() {
        if (puedeAumentar && !stockAlcanzado) {
            onAumentar(codigo)
        }
    }

    function manejarDisminuir() {
        if (puedeDisminuir) {
            onDisminuir(codigo)
        }
    }

    function manejarEliminar() {
        if (puedeEliminar) {
            onEliminar(codigo)
        }
    }

    return (
        <article className="producto-carrito">
            <img
                src={imagen}
                alt={nombre}
                loading="lazy"
            />

            <section className="informacion-carrito">
                <h3>{nombre}</h3>
                <p>{descripcion}</p>
            </section>

            <section className="control-producto">
                <p className="precio-producto-carrito">
                    {precioFormateado}
                </p>

                <section
                    className="control-cantidad"
                    aria-label={`Cantidad de ${nombre}`}
                >
                    <button
                        type="button"
                        onClick={manejarDisminuir}
                        disabled={!puedeDisminuir}
                        aria-label={`Disminuir cantidad de ${nombre}`}
                    >
                        −
                    </button>

                    <span
                        aria-label={`Cantidad actual: ${cantidad}`}
                    >
                        {cantidad}
                    </span>

                    <button
                        type="button"
                        onClick={manejarAumentar}
                        disabled={!puedeAumentar || stockAlcanzado}
                        aria-label={`Aumentar cantidad de ${nombre}`}
                    >
                        +
                    </button>
                </section>

                <button
                    type="button"
                    className="btn btn-link btn-sm mt-2"
                    onClick={manejarEliminar}
                    disabled={!puedeEliminar}
                    aria-label={`Eliminar ${nombre} del carrito`}
                >
                    Eliminar
                </button>
            </section>
        </article>
    )
}

export default ItemCarrito
