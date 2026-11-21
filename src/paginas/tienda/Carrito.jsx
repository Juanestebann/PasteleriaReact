
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import ItemCarrito from '../../componentes/moleculas/ItemCarrito'
import { productosIniciales } from '../../datos/productos'
import { crearBoleta } from '../../servicios/boletas'
import { leerSesion } from '../../servicios/sesion'
import { mensajeDeError } from '../../servicios/errores'
import { obtenerRol, ROLES } from '../../utils/roles'
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

function Carrito({ productos = productosIniciales, sesion, onCompraRealizada }) {
    const navegar = useNavigate()
    const pagandoRef = useRef(false)
    const [carrito, setCarrito] = useState(leerCarrito)
    const [codigoCupon, setCodigoCupon] = useState('')
    const [cuponAplicado, setCuponAplicado] = useState('')
    const [boletaConfirmada, setBoletaConfirmada] = useState(null)
    const [errorCompra, setErrorCompra] = useState('')
    const [pagando, setPagando] = useState(false)

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

    async function manejarPagar() {
        if (pagandoRef.current || carrito.length === 0) return

        // El JWT viaja mediante el interceptor de src/servicios/api.js.
        if (!leerSesion()?.accessToken || !sesion) {
            navegar('/login', { state: { from: { pathname: '/carrito' } } })
            return
        }

        if (obtenerRol(sesion) !== ROLES.CLIENTE) {
            setErrorCompra('Solo una cuenta de cliente puede realizar compras.')
            return
        }

        pagandoRef.current = true
        setPagando(true)
        setErrorCompra('')
        setBoletaConfirmada(null)

        try {
            const boleta = await crearBoleta(carrito, cuponAplicado)
            if (!boleta || boleta.id == null) {
                throw new Error('El servidor no confirmó la compra. Revisa tus compras antes de reintentar.')
            }

            const carritoVacio = vaciarCarrito()

            guardarCarrito(carritoVacio)
            setCarrito(carritoVacio)
            setCuponAplicado('')
            setCodigoCupon('')
            setBoletaConfirmada(boleta)
            // La actualización del inventario no debe invalidar una compra ya confirmada.
            try {
                await onCompraRealizada?.()
            } catch {
                // El inventario volverá a solicitarse al recargar la tienda.
            }
        } catch (error) {
            setErrorCompra(mensajeDeError(error))
        } finally {
            pagandoRef.current = false
            setPagando(false)
        }
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

            {boletaConfirmada && (
                <p className="alert alert-success mt-3" role="status">
                    ¡Compra realizada correctamente! Boleta N.º {boletaConfirmada.id}.
                    {' '}Total confirmado: {formatearPrecio(boletaConfirmada.total)}.
                </p>
            )}

            {errorCompra && (
                <p className="alert alert-danger mt-3" role="alert">{errorCompra}</p>
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
                                onAumentar={pagando ? undefined : manejarAumentar}
                                onDisminuir={pagando ? undefined : manejarDisminuir}
                                onEliminar={pagando ? undefined : manejarEliminar}
                            />
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-secondary mt-3"
                            onClick={manejarVaciar}
                            disabled={pagando}
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
                                    disabled={pagando}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                    disabled={pagando}
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
                                disabled={pagando}
                            >
                                {pagando ? 'Procesando compra...' : 'PAGAR'}
                            </button>
                        </section>
                    </aside>
                </div>
            )}
        </main>
    )
}

export default Carrito
