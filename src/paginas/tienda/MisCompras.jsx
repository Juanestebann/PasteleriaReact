import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { listarMisCompras } from '../../servicios/boletas'
import { fechaOrden, mensajeErrorBoleta, monedaOrden, unidadesOrden } from '../admin/ordenesFormato'

function MisCompras() {
    const [compras, setCompras] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0)

    useEffect(() => {
        let activo = true
        async function cargarCompras() {
            try {
                const datos = await listarMisCompras()
                if (!Array.isArray(datos)) throw new Error('Respuesta inesperada de la API')
                if (activo) {
                    setCompras([...datos].sort((a, b) => Number(b.id) - Number(a.id)))
                    setError('')
                }
            } catch (fallo) {
                if (activo) setError(mensajeErrorBoleta(fallo, 'No fue posible cargar tus compras.'))
            } finally {
                if (activo) setCargando(false)
            }
        }
        cargarCompras()
        return () => { activo = false }
    }, [intento])

    return (
        <section className="mis-compras-react" aria-labelledby="titulo-mis-compras">
            <div className="mis-compras-cabecera">
                <div>
                    <h2 id="titulo-mis-compras">Mis compras</h2>
                    <p>Consulta las boletas de tus compras en Pastelería Mil Sabores.</p>
                </div>
                <Link className="btn btn-principal" to="/productos">Ver productos</Link>
            </div>

            {cargando && <p role="status">Cargando mis compras…</p>}
            {!cargando && error && (
                <div role="alert" className="mis-compras-mensaje">
                    <p>{error}</p>
                    <button type="button" className="btn btn-principal" onClick={() => { setCargando(true); setIntento(n => n + 1) }}>Reintentar</button>
                </div>
            )}
            {!cargando && !error && compras.length === 0 && (
                <div className="mis-compras-mensaje">
                    <p>Aún no tienes compras registradas.</p>
                    <Link to="/productos">Explorar catálogo</Link>
                </div>
            )}
            {!cargando && !error && compras.length > 0 && (
                <div className="mis-compras-lista">
                    {compras.map(compra => (
                        <article className="mis-compras-tarjeta" key={compra.id}>
                            <div>
                                <h3>Boleta #{compra.id}</h3>
                                <p>Fecha: {fechaOrden(compra.fecha)}</p>
                                <p>Productos: {unidadesOrden(compra)} unidades</p>
                            </div>
                            <div className="mis-compras-resumen">
                                <strong>{monedaOrden(compra.total)}</strong>
                                <Link className="btn btn-principal" to={`/mis-compras/${compra.id}`}>Ver detalle</Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default MisCompras
