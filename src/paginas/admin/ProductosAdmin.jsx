
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
    obtenerProductos,
    eliminarProductoApi
} from '../../servicios/productosApi'

const EVENTO_INVENTARIO_ACTUALIZADO = 'inventario-productos-actualizado'

const formatearPrecio = (precio) =>
    '$' + precio.toLocaleString('es-CL')

const normalizar = (texto) =>
    String(texto)
        .toLocaleLowerCase('es-CL')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

const mostrarCategoria = (categoria) =>
    categoria
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase())

function ProductosAdmin({
                            productos,
                            puedeGestionar = true,
                            onEliminar
                        }) {
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [productosApi, setProductosApi] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState('')
    const [intentos, setIntentos] = useState(0)
    const [eliminandoCodigo, setEliminandoCodigo] = useState('')

    // Compatibilidad con App.jsx anterior y pruebas originales.
    const usaProductosExternos = Array.isArray(productos)
    const inventario = usaProductosExternos
        ? productos
        : productosApi

    // C3-07: consulta el inventario desde Spring Boot.
    useEffect(() => {
        if (usaProductosExternos) return

        let activo = true

        async function cargarProductos() {
            setCargando(true)
            setError('')

            try {
                const respuesta = await obtenerProductos()

                if (!activo) return

                if (!Array.isArray(respuesta)) {
                    throw new Error('Respuesta de productos inválida')
                }

                setProductosApi(respuesta)
            } catch (errorProductos) {
                if (!activo) return

                console.error(
                    'No se pudieron cargar los productos:',
                    errorProductos
                )

                setError('No se pudieron cargar los productos.')
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        cargarProductos()

        return () => {
            activo = false
        }
    }, [usaProductosExternos, intentos])

    function reintentarCarga() {
        setIntentos(actuales => actuales + 1)
    }

    async function confirmarEliminacion(producto) {
        if (!puedeGestionar || eliminandoCodigo) return

        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar el producto ${producto.nombre} (${producto.codigo})?`
        )

        if (!confirmado) return

        // Compatibilidad con los callbacks anteriores.
        if (typeof onEliminar === 'function') {
            onEliminar(producto.codigo)
            return
        }

        if (producto.id == null) {
            setError('No se encontró el identificador del producto.')
            return
        }

        setEliminandoCodigo(producto.codigo)
        setError('')

        try {
            await eliminarProductoApi(producto.id)

            // Refleja inmediatamente el cambio en la tabla.
            setProductosApi(actuales =>
                actuales.filter(actual => actual.id !== producto.id)
            )

            // C3-07: sincroniza Inicio, Detalle y el inventario
            // compartido de App.jsx con la información del backend.
            window.dispatchEvent(
                new Event(EVENTO_INVENTARIO_ACTUALIZADO)
            )
        } catch (errorEliminacion) {
            console.error(
                'No se pudo eliminar el producto:',
                errorEliminacion
            )

            const estado = errorEliminacion.response?.status

            if (estado === 403) {
                setError(
                    'No tienes permisos para eliminar productos.'
                )
            } else if (estado === 404) {
                setError(
                    'El producto ya no existe en el servidor.'
                )
            } else {
                setError(
                    'No se pudo eliminar el producto. Inténtalo nuevamente.'
                )
            }
        } finally {
            setEliminandoCodigo('')
        }
    }

    const totalProductos = inventario.length

    const productosCriticos = inventario.filter(
        producto => producto.stock <= producto.stockCritico
    ).length

    const categorias = [
        ...new Set(inventario.map(producto => producto.categoria))
    ]

    const productosFiltrados = inventario.filter(producto => {
        const texto = normalizar(
            `${producto.codigo} ${producto.nombre}`
        )

        const coincideBusqueda = texto.includes(
            normalizar(busqueda)
        )

        const coincideFiltro =
            filtro === 'todos' ||
            (filtro === 'criticos' &&
                producto.stock <= producto.stockCritico) ||
            producto.categoria === filtro

        return coincideBusqueda && coincideFiltro
    })

    return (
        <div className="productos-admin-react">
            <section
                id="productos-presentacion"
                className="panel panel-presentacion"
            >
                <h2>Gestión de productos</h2>
                <p>
                    Consulta el inventario, revisa el stock y administra
                    los productos disponibles en la pastelería.
                </p>
            </section>

            <section
                id="productos-resumen"
                aria-label="Resumen de productos"
            >
                <article className="panel producto-resumen">
                    <span
                        className="resumen-icono"
                        aria-hidden="true"
                    >
                        📦
                    </span>

                    <div>
                        <h3>Total productos</h3>
                        <p>{totalProductos}</p>
                    </div>
                </article>

                <article className="panel producto-resumen">
                    <span
                        className="resumen-icono"
                        aria-hidden="true"
                    >
                        ⚠️
                    </span>

                    <div>
                        <h3>Stock crítico</h3>
                        <p>{productosCriticos}</p>
                    </div>
                </article>
            </section>

            <section
                id="productos-filtro"
                className="panel herramientas-productos-admin"
                aria-label="Herramientas de productos"
            >
                <div className="busqueda-productos-admin">
                    <label htmlFor="buscar-producto-admin">
                        Buscar producto
                    </label>

                    <input
                        id="buscar-producto-admin"
                        className="form-control"
                        type="search"
                        value={busqueda}
                        onChange={evento =>
                            setBusqueda(evento.target.value)
                        }
                        placeholder="Buscar producto..."
                    />
                </div>

                <div className="filtro-categoria-productos">
                    <label htmlFor="filtrar-producto-admin">
                        Filtrar productos
                    </label>

                    <select
                        id="filtrar-producto-admin"
                        className="form-select"
                        value={filtro}
                        onChange={evento =>
                            setFiltro(evento.target.value)
                        }
                    >
                        <option value="todos">
                            Todas las categorías
                        </option>

                        <option value="criticos">
                            Stock crítico
                        </option>

                        {categorias.map(categoria => (
                            <option
                                key={categoria}
                                value={categoria}
                            >
                                {mostrarCategoria(categoria)}
                            </option>
                        ))}
                    </select>
                </div>

                {puedeGestionar && (
                    <Link
                        id="boton-nuevo-producto"
                        to="/admin/productos/nuevo"
                        className="btn btn-principal"
                    >
                        + Nuevo producto
                    </Link>
                )}
            </section>

            {error && (
                <div className="panel" role="alert">
                    <p>{error}</p>

                    {!usaProductosExternos && (
                        <button
                            type="button"
                            className="btn btn-principal"
                            onClick={reintentarCarga}
                        >
                            Reintentar
                        </button>
                    )}
                </div>
            )}

            <section className="panel listado-productos-admin">
                <div id="productos-listado-header">
                    <h2>Productos registrados</h2>
                    <p>Inventario disponible en el sistema.</p>
                </div>

                {cargando ? (
                    <p role="status">
                        Cargando productos...
                    </p>
                ) : (
                    <>
                        <div className="tabla-contenedor">
                            <table
                                id="tabla-productos"
                                className="tabla-admin"
                            >
                                <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Stock crítico</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>

                                <tbody>
                                {productosFiltrados.map(producto => {
                                    const sinStock =
                                        producto.stock === 0

                                    const critico =
                                        producto.stock <=
                                        producto.stockCritico

                                    const estado = sinStock
                                        ? 'Sin stock'
                                        : critico
                                            ? 'Stock crítico'
                                            : 'Disponible'

                                    return (
                                        <tr key={producto.codigo}>
                                            <td>
                                                <img
                                                    className="imagen-producto-admin"
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                />
                                            </td>

                                            <td>
                                                {producto.codigo}
                                            </td>

                                            <td>
                                                {producto.nombre}
                                            </td>

                                            <td>
                                                {mostrarCategoria(
                                                    producto.categoria
                                                )}
                                            </td>

                                            <td>
                                                {formatearPrecio(
                                                    producto.precio
                                                )}
                                            </td>

                                            <td>
                                                {producto.stock}
                                            </td>

                                            <td>
                                                {producto.stockCritico}
                                            </td>

                                            <td>
                                                    <span
                                                        className={
                                                            'estado-producto-admin ' +
                                                            (critico
                                                                ? 'estado-producto-critico'
                                                                : 'estado-producto-disponible')
                                                        }
                                                    >
                                                        {estado}
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="celda-acciones">
                                                    {puedeGestionar ? (
                                                        <>
                                                            <Link
                                                                to={`/admin/productos/${producto.codigo}/editar`}
                                                                className="btn btn-principal"
                                                                aria-label={`Editar ${producto.nombre}`}
                                                            >
                                                                Editar
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                className="btn btn-eliminar-producto"
                                                                aria-label={`Eliminar ${producto.nombre}`}
                                                                disabled={
                                                                    Boolean(eliminandoCodigo)
                                                                }
                                                                onClick={() =>
                                                                    confirmarEliminacion(producto)
                                                                }
                                                            >
                                                                {eliminandoCodigo === producto.codigo
                                                                    ? 'Eliminando...'
                                                                    : 'Eliminar'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span>
                                                                Solo lectura
                                                            </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>

                        {!error && productosFiltrados.length === 0 && (
                            <p role="status">
                                No se encontraron productos.
                            </p>
                        )}
                    </>
                )}
            </section>
        </div>
    )
}

export default ProductosAdmin
