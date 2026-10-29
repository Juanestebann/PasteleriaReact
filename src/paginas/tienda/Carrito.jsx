
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ItemCarrito from '../../componentes/moleculas/ItemCarrito'
import { productosIniciales } from '../../datos/productos'
import {
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    calcularSubtotal,
    calcularDescuento,
    calcularTotal,
    validarCupon,
    vaciarCarrito
} from '../../utils/carrito'
import {
    leerCarrito,
    guardarCarrito
} from '../../utils/almacenamiento'

const formatearPrecio = valor =>
    '$' + valor.toLocaleString('es-CL')

function Carrito({ productos = productosIniciales }) {
    const [carrito, setCarrito] = useState(leerCarrito)
    const [codigoCupon, setCodigoCupon] = useState('')
    const [cuponAplicado, setCuponAplicado] = useState('')
    const [compraRealizada, setCompraRealizada] = useState(false)

    useEffect(() => {
        guardarCarrito(carrito)
    }, [carrito])

    const productosCarrito = carrito.map(item => {
        const productoActual = productos.find(
            producto => producto.codigo === item.codigo
        )

        return {
            ...item,
            precio: productoActual?.precio ?? item.precio,
            stock: productoActual?.stock ?? 0
        }
    })

    const subtotal = calcularSubtotal(productosCarrito)
    const descuento = calcularDescuento(
        productosCarrito,
        cuponAplicado
    )
    const total = calcularTotal(
        productosCarrito,
        cuponAplicado
    )

    function manejarAumentar(codigo) {
        const producto = productosCarrito.find(
            item => item.codigo === codigo
        )

        if (!producto || producto.cantidad >= producto.stock) {
            return
        }

        setCarrito(actual => aumentarCantidad(actual, codigo))
    }

    function manejarDisminuir(codigo) {
        setCarrito(actual => disminuirCantidad(actual, codigo))
    }

    function manejarEliminar(codigo) {
        setCarrito(actual => eliminarProducto(actual, codigo))
    }

    function manejarVaciar() {
        setCarrito(vaciarCarrito())
        setCuponAplicado('')
        setCodigoCupon('')
    }

    function manejarPagar() {
        if (carrito.length === 0) return

        setCarrito(vaciarCarrito())
        setCuponAplicado('')
        setCodigoCupon('')
        setCompraRealizada(true)
    }

    function manejarCupon(evento) {
        evento.preventDefault()

        if (validarCupon(codigoCupon)) {
            setCuponAplicado(codigoCupon.trim().toLowerCase())
        } else {
            setCuponAplicado('')
        }
    }

    return (
        <main className="container py-5">
            <h1>Carrito de compras</h1>

            {compraRealizada && (
                <p className="alert alert-success mt-3" role="status">
                    ¡Compra realizada correctamente!
                </p>
            )}

            {productosCarrito.length === 0 ? (
                <section className="text-center py-5">
                    <p>Tu carrito está vacío.</p>
                    <Link
                        to="/productos"
                        className="btn btn-primary"
                    >
                        Ver productos
                    </Link>
                </section>
            ) : (
                <div className="row g-4 mt-2">
                    <section className="col-12 col-lg-8">
                        {productosCarrito.map(producto => (
                            <ItemCarrito
                                key={producto.codigo}
                                producto={producto}
                                onAumentar={manejarAumentar}
                                onDisminuir={manejarDisminuir}
                                onEliminar={manejarEliminar}
                            />
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-secondary mt-3"
                            onClick={manejarVaciar}
                        >
                            Vaciar carrito
                        </button>
                    </section>

                    <aside className="col-12 col-lg-4">
                        <section className="card p-4">
                            <h2 className="h4">Resumen de compra</h2>

                            <div className="d-flex justify-content-between my-3">
                                <span>Subtotal</span>
                                <strong>
                                    {formatearPrecio(subtotal)}
                                </strong>
                            </div>

                            <form onSubmit={manejarCupon}>
                                <label
                                    htmlFor="codigo-cupon"
                                    className="form-label"
                                >
                                    Código de descuento
                                </label>

                                <input
                                    id="codigo-cupon"
                                    className="form-control"
                                    type="text"
                                    value={codigoCupon}
                                    onChange={evento =>
                                        setCodigoCupon(evento.target.value)
                                    }
                                    placeholder="Ingresa tu cupón"
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                >
                                    Aplicar cupón
                                </button>
                            </form>

                            {cuponAplicado && (
                                <p
                                    className="text-success mt-2"
                                    role="status"
                                >
                                    Cupón aplicado correctamente.
                                </p>
                            )}

                            <div className="d-flex justify-content-between my-3">
                                <span>Descuento</span>
                                <span>
                                    {descuento > 0
                                        ? `-${formatearPrecio(descuento)}`
                                        : formatearPrecio(0)}
                                </span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between">
                                <strong>Total</strong>
                                <strong>
                                    {formatearPrecio(total)}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100 mt-3"
                                onClick={manejarPagar}
                            >
                                PAGAR
                            </button>
                        </section>
                    </aside>
                </div>
            )}
        </main>
    )
}

export default Carrito
