import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { obtenerBoleta } from '../../servicios/boletas'
import { fechaOrden, mensajeErrorBoleta, monedaOrden } from '../admin/ordenesFormato'

function DetalleCompra() {
    const { id } = useParams()
    const [compra, setCompra] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let activo = true
        async function cargarDetalle() {
            try {
                const datos = await obtenerBoleta(id)
                if (!datos || !Array.isArray(datos.detalle)) throw new Error('Respuesta inesperada de la API')
                if (activo) { setCompra(datos); setError('') }
            } catch (fallo) {
                if (activo) { setCompra(null); setError(mensajeErrorBoleta(fallo, 'No fue posible consultar esta compra.')) }
            } finally {
                if (activo) setCargando(false)
            }
        }
        cargarDetalle()
        return () => { activo = false }
    }, [id, intento])

    return (
        <section className="mis-compras-react" aria-labelledby="titulo-detalle-compra">
            <div className="mis-compras-cabecera">
                <div><h2 id="titulo-detalle-compra">Detalle de compra #{id}</h2><p>Productos y valores de tu boleta.</p></div>
                <Link to="/mis-compras">Volver a mis compras</Link>
            </div>
            {cargando && <p role="status">Cargando detalle…</p>}
            {!cargando && error && <div role="alert" className="mis-compras-mensaje"><p>{error}</p><button type="button" className="btn btn-principal" onClick={() => { setCargando(true); setIntento(n => n + 1) }}>Reintentar</button></div>}
            {!cargando && !error && compra && (
                <div className="mis-compras-detalle">
                    <p><strong>Boleta:</strong> #{compra.id}</p>
                    <p><strong>Fecha:</strong> {fechaOrden(compra.fecha)}</p>
                    <div className="mis-compras-tabla-contenedor">
                        <table>
                            <thead><tr><th scope="col">Producto</th><th scope="col">Código</th><th scope="col">Cantidad</th><th scope="col">Precio unitario</th><th scope="col">Subtotal</th></tr></thead>
                            <tbody>{compra.detalle.map((linea, indice) => (
                                <tr key={`${linea.codigo}-${indice}`}>
                                    <td>{linea.nombre}</td><td>{linea.codigo}</td><td>{linea.cantidad}</td>
                                    <td>{monedaOrden(linea.precioUnitario)}</td><td>{monedaOrden(linea.subtotal)}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                    <div className="mis-compras-totales">
                        <p><span>Subtotal</span><strong>{monedaOrden(compra.subtotal)}</strong></p>
                        <p><span>Descuento</span><strong>- {monedaOrden(compra.descuento)}</strong></p>
                        <p className="mis-compras-total-final"><span>Total pagado</span><strong>{monedaOrden(compra.total)}</strong></p>
                    </div>
                </div>
            )}
        </section>
    )
}

export default DetalleCompra
