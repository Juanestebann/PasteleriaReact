import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { listarBoletas } from '../../servicios/boletas'
import { fechaOrden, mensajeErrorBoleta, monedaOrden, unidadesOrden } from './ordenesFormato'

function OrdenesAdmin() {
    const [ordenes, setOrdenes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let activo = true
        async function cargar() {
            try {
                const datos = await listarBoletas()
                if (!Array.isArray(datos)) throw new Error('Respuesta inesperada')
                if (activo) { setOrdenes(datos); setError('') }
            } catch (fallo) {
                if (activo) setError(mensajeErrorBoleta(fallo, 'No fue posible obtener las órdenes.'))
            } finally {
                if (activo) setCargando(false)
            }
        }
        cargar()
        return () => { activo = false }
    }, [intento])

    return (
        <div className="ordenes-admin-react">
            <section className="panel ordenes-presentacion">
                <h2>Órdenes registradas</h2>
                <p>Consulta las compras realizadas en la pastelería.</p>
            </section>
            <section className="panel ordenes-contenido" aria-label="Listado de órdenes">
                {cargando && <p role="status">Cargando órdenes…</p>}
                {!cargando && error && (
                    <div role="alert">
                        <p>{error}</p>
                        <button type="button" className="btn btn-principal" onClick={() => { setCargando(true); setIntento((actual) => actual + 1) }}>Reintentar</button>
                    </div>
                )}
                {!cargando && !error && ordenes.length === 0 && <p>No hay órdenes registradas todavía.</p>}
                {!cargando && !error && ordenes.length > 0 && (
                    <div className="tabla-contenedor">
                        <table className="tabla-admin">
                            <thead><tr><th scope="col">Boleta</th><th scope="col">Fecha</th><th scope="col">Unidades</th><th scope="col">Total</th><th scope="col">Acción</th></tr></thead>
                            <tbody>
                                {ordenes.map((orden) => (
                                    <tr key={orden.id}>
                                        <td>#{orden.id}</td>
                                        <td>{fechaOrden(orden.fecha)}</td>
                                        <td>{unidadesOrden(orden)}</td>
                                        <td>{monedaOrden(orden.total)}</td>
                                        <td><Link to={`/admin/ordenes/${orden.id}`} className="ordenes-enlace">Ver detalle</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}

export default OrdenesAdmin
