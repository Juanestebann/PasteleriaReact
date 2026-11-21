import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { obtenerBoleta } from '../../servicios/boletas'
import { fechaOrden, mensajeErrorBoleta, monedaOrden } from './ordenesFormato'

function DetalleOrden() {
    const { id } = useParams()
    const [boleta, setBoleta] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let activo = true
        async function cargar() {
            try {
                const datos = await obtenerBoleta(id)
                if (!datos || !Array.isArray(datos.detalle)) throw new Error('Respuesta inesperada')
                if (activo) { setBoleta(datos); setError('') }
            } catch (fallo) {
                if (activo) setError(mensajeErrorBoleta(fallo, 'No fue posible obtener el detalle de la orden.'))
            } finally {
                if (activo) setCargando(false)
            }
        }
        cargar()
        return () => { activo = false }
    }, [id, intento])

    return (
        <div className="ordenes-admin-react">
            <section className="panel ordenes-presentacion">
                <div><h2>Detalle de orden #{id}</h2><p>Información registrada al completar la compra.</p></div>
                <Link className="ordenes-enlace" to="/admin/ordenes">Volver a órdenes</Link>
            </section>
            <section className="panel ordenes-contenido" aria-label="Detalle de la orden">
                {cargando && <p role="status">Cargando detalle…</p>}
                {!cargando && error && (
                    <div role="alert"><p>{error}</p><button type="button" className="btn btn-principal" onClick={() => { setCargando(true); setIntento((actual) => actual + 1) }}>Reintentar</button></div>
                )}
                {!cargando && !error && boleta && (
                    <>
                        <p><strong>Boleta:</strong> #{boleta.id}</p>
                        <p><strong>Fecha:</strong> {fechaOrden(boleta.fecha)}</p>
                        <div className="tabla-contenedor">
                            <table className="tabla-admin">
                                <thead><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Cantidad</th><th scope="col">Precio unitario</th><th scope="col">Subtotal</th></tr></thead>
                                <tbody>
                                    {boleta.detalle.map((linea, indice) => (
                                        <tr key={`${linea.codigo}-${indice}`}>
                                            <td>{linea.codigo}</td><td>{linea.nombre}</td><td>{linea.cantidad}</td>
                                            <td>{monedaOrden(linea.precioUnitario)}</td><td>{monedaOrden(linea.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="ordenes-totales">
                            <p><span>Subtotal</span><strong>{monedaOrden(boleta.subtotal)}</strong></p>
                            <p><span>Descuento</span><strong>- {monedaOrden(boleta.descuento)}</strong></p>
                            <p className="ordenes-total-final"><span>Total</span><strong>{monedaOrden(boleta.total)}</strong></p>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}

export default DetalleOrden
