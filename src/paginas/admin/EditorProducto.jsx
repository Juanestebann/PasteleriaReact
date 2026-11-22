
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import { buscarProductoPorCodigo } from '../../utils/productos'
import {
    obtenerProductos,
    obtenerProductoPorCodigo,
    crearProductoApi,
    actualizarProductoApi
} from '../../servicios/productosApi'

const EVENTO_INVENTARIO_ACTUALIZADO = 'inventario-productos-actualizado'

function EditorProducto({
                            productos,
                            onCrear,
                            onActualizar
                        }) {
    const { codigo } = useParams()
    const navegar = useNavigate()

    const modo = codigo ? 'editar' : 'nuevo'
    const esEdicion = modo === 'editar'

    // Compatibilidad con las pruebas y callbacks originales.
    const usaDatosExternos = Array.isArray(productos)

    const [inventarioApi, setInventarioApi] = useState([])
    const [productoApi, setProductoApi] = useState(null)
    const [cargando, setCargando] = useState(!usaDatosExternos)
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState('')
    const [intentos, setIntentos] = useState(0)

    const inventario = usaDatosExternos
        ? productos
        : inventarioApi

    const productoEditado = usaDatosExternos
        ? (
            esEdicion
                ? buscarProductoPorCodigo(inventario, codigo)
                : null
        )
        : productoApi

    // C3-07: obtener productos reales para el formulario.
    useEffect(() => {
        if (usaDatosExternos) return

        let activo = true

        async function cargarDatos() {
            setCargando(true)
            setError('')
            setProductoApi(null)

            try {
                const lista = await obtenerProductos()

                if (!Array.isArray(lista)) {
                    throw new Error('Inventario inválido')
                }

                if (!activo) return

                setInventarioApi(lista)

                if (esEdicion) {
                    const encontrado =
                        await obtenerProductoPorCodigo(codigo)

                    if (activo) {
                        setProductoApi(encontrado)
                    }
                }
            } catch (errorCarga) {
                if (!activo) return

                console.error(
                    'No se pudieron cargar los datos del producto:',
                    errorCarga
                )

                if (errorCarga.response?.status === 404) {
                    setError('Producto no encontrado.')
                } else {
                    setError(
                        'No se pudieron cargar los datos del producto.'
                    )
                }
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        cargarDatos()

        return () => {
            activo = false
        }
    }, [usaDatosExternos, esEdicion, codigo, intentos])

    async function guardar(producto) {
        if (guardando) return

        // Compatibilidad con los callbacks de las pruebas originales.
        if (usaDatosExternos) {
            const resultado = esEdicion
                ? onActualizar(producto)
                : onCrear(producto)

            if (
                resultado &&
                typeof resultado.then === 'function'
            ) {
                await resultado
            }

            navegar('/admin/productos')
            return
        }

        setGuardando(true)
        setError('')

        try {
            if (esEdicion) {
                if (productoEditado?.id == null) {
                    throw new Error(
                        'ID de producto no disponible'
                    )
                }

                await actualizarProductoApi(
                    productoEditado.id,
                    producto
                )
            } else {
                await crearProductoApi(producto)
            }

            // C3-07: sincroniza el inventario compartido.
            // Solo ocurre cuando el backend confirma el guardado.
            window.dispatchEvent(
                new Event(EVENTO_INVENTARIO_ACTUALIZADO)
            )

            navegar('/admin/productos')
        } catch (errorGuardar) {
            console.error(
                'No se pudo guardar el producto:',
                errorGuardar
            )

            const estado = errorGuardar.response?.status

            if (estado === 409) {
                setError(
                    'El código del producto ya está registrado.'
                )
            } else if (estado === 400) {
                setError(
                    'Revisa los datos ingresados en el formulario.'
                )
            } else if (estado === 403) {
                setError(
                    'No tienes permisos para administrar productos.'
                )
            } else {
                setError(
                    'No se pudo guardar el producto. Inténtalo nuevamente.'
                )
            }
        } finally {
            setGuardando(false)
        }
    }

    return (
        <main
            id="principal-admin"
            className="productos-admin-react"
        >
            <section
                id={
                    esEdicion
                        ? 'editar-producto-presentacion'
                        : 'nuevo-producto-presentacion'
                }
                className="panel panel-presentacion presentacion-acciones"
            >
                <div>
                    <h2>
                        {esEdicion
                            ? 'Editar producto'
                            : 'Nuevo producto'}
                    </h2>

                    <p>
                        {esEdicion
                            ? 'Modifica los datos del producto seleccionado.'
                            : 'Registra un nuevo producto en el inventario.'}
                    </p>
                </div>

                <Link
                    id="volver-productos"
                    className="btn btn-admin btn-secundario"
                    to="/admin/productos"
                >
                    ← Volver a productos
                </Link>
            </section>

            {error && (
                <div className="panel" role="alert">
                    <p>{error}</p>

                    {!usaDatosExternos &&
                        !guardando &&
                        !error.startsWith('El código') &&
                        !error.startsWith('Revisa los datos') && (
                            <button
                                type="button"
                                className="btn btn-principal"
                                onClick={() =>
                                    setIntentos(actual => actual + 1)
                                }
                            >
                                Reintentar carga
                            </button>
                        )}
                </div>
            )}

            {cargando ? (
                <section className="panel">
                    <p role="status">
                        Cargando datos del producto...
                    </p>
                </section>
            ) : esEdicion && !productoEditado ? (
                <section className="panel">
                    <h3>Producto no encontrado</h3>

                    <p>
                        No existe un producto registrado con el
                        código solicitado.
                    </p>

                    <Link to="/admin/productos">
                        Volver al listado
                    </Link>
                </section>
            ) : (
                <section className="panel panel-con-borde editor-producto-panel">
                    {guardando && (
                        <p role="status">
                            Guardando producto...
                        </p>
                    )}

                    <FormularioProducto
                        key={codigo ?? 'nuevo'}
                        modo={modo}
                        productoInicial={productoEditado}
                        productosExistentes={inventario}
                        onGuardar={guardar}
                        onCancelar={() =>
                            navegar('/admin/productos')
                        }
                    />
                </section>
            )}
        </main>
    )
}

export default EditorProducto
