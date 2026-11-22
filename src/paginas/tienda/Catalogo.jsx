
import { useSearchParams } from 'react-router'
import TarjetaProducto from '../../componentes/moleculas/TarjetaProducto'
import { agregarProducto } from '../../utils/carrito'
import { leerCarrito, guardarCarrito } from '../../utils/almacenamiento'
import { useEffect, useState } from 'react'
import { obtenerCategorias } from '../../servicios/categorias'
import { obtenerProductos } from '../../servicios/productosApi'

const categoriasIniciales = [
    { codigo: 'todos', nombre: 'Todos' },
    { codigo: 'cuadradas', nombre: 'Tortas Cuadradas' },
    { codigo: 'circulares', nombre: 'Tortas Circulares' },
    { codigo: 'individuales', nombre: 'Postres Individuales' },
    { codigo: 'sin-azucar', nombre: 'Sin Azúcar' },
    { codigo: 'tradicional', nombre: 'Tradicional' },
    { codigo: 'sin-gluten', nombre: 'Sin Gluten' },
    { codigo: 'veganos', nombre: 'Veganos' },
    { codigo: 'especiales', nombre: 'Tortas Especiales' }
]

function Catalogo({ productos: _productos }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [mensajeCarrito, setMensajeCarrito] = useState('')
    const [categorias, setCategorias] = useState(categoriasIniciales)
    const [inventario, setInventario] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intentos, setIntentos] = useState(0)

    const categoriaURL = searchParams.get('categoria') || 'todos'
    const categoriaSeleccionada = categorias.some(
        categoria => categoria.codigo === categoriaURL
    ) ? categoriaURL : 'todos'

    const busqueda = searchParams.get('buscar') || ''

    // C3-06: obtener las categorías desde la API REST.
    useEffect(() => {
        let activo = true

        async function cargarCategorias() {
            try {
                const respuesta = await obtenerCategorias()

                if (activo && Array.isArray(respuesta)) {
                    setCategorias([
                        { codigo: 'todos', nombre: 'Todos' },
                        ...respuesta.map(categoria => ({
                            codigo: categoria.slug,
                            nombre: categoria.nombre
                        }))
                    ])
                }
            } catch (errorCategorias) {
                console.error(
                    'No se pudieron cargar las categorías:',
                    errorCategorias
                )
            }
        }

        cargarCategorias()

        return () => {
            activo = false
        }
    }, [])

    // C3-06: consultar los productos según la categoría seleccionada.
    useEffect(() => {
        let activo = true

        async function cargarProductos() {
            setCargando(true)
            setError('')
            setInventario([])

            try {
                const categoria = categoriaURL === 'todos'
                    ? ''
                    : categoriaURL

                const respuesta = await obtenerProductos(categoria)

                if (!activo) return

                if (!Array.isArray(respuesta)) {
                    throw new Error('Respuesta de productos inválida')
                }

                setInventario(respuesta)
            } catch (errorProductos) {
                if (!activo) return

                console.error(
                    'No se pudieron cargar los productos:',
                    errorProductos
                )

                setError('No hay conexión con el servidor.')
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
    }, [categoriaURL, intentos])

    function reintentarCarga() {
        setIntentos(actuales => actuales + 1)
    }

    function manejarAgregar(producto) {
        const carritoActual = leerCarrito()
        const carritoNuevo = agregarProducto(carritoActual, producto, 1)

        if (carritoNuevo === carritoActual) {
            setMensajeCarrito(`No se pudo añadir ${producto.nombre}: se alcanzó el stock disponible.`)
            return
        }

        if (guardarCarrito(carritoNuevo)) {
            setMensajeCarrito(`${producto.nombre} añadido al carrito.`)
        } else {
            setMensajeCarrito('No se pudo guardar el carrito. Inténtalo de nuevo.')
        }
    }

    // La búsqueda por nombre permanece en el navegador.
    const productosFiltrados = inventario.filter(producto =>
        producto.nombre
            .toLocaleLowerCase('es-CL')
            .includes(busqueda.trim().toLocaleLowerCase('es-CL'))
    )

    function cambiarCategoria(nuevaCategoria) {
        setSearchParams(actuales => {
            const parametros = new URLSearchParams(actuales)

            if (nuevaCategoria === 'todos') {
                parametros.delete('categoria')
            } else {
                parametros.set('categoria', nuevaCategoria)
            }

            return parametros
        })
    }

    function cambiarBusqueda(evento) {
        const texto = evento.target.value

        setSearchParams(actuales => {
            const parametros = new URLSearchParams(actuales)

            if (texto.trim() === '') {
                parametros.delete('buscar')
            } else {
                parametros.set('buscar', texto)
            }

            return parametros
        }, { replace: true })
    }

    return (
        <main>
            <section id="catalogo-completo">
                <h2>PRODUCTOS</h2>

                <p>
                    Descubre todos nuestros productos de pastelería
                </p>

                <nav
                    id="categorias"
                    aria-label="Categorías de productos"
                >
                    {categorias.map(categoria => (
                        <a
                            key={categoria.codigo}
                            href={
                                categoria.codigo === 'todos'
                                    ? '/productos'
                                    : `/productos?categoria=${categoria.codigo}`
                            }
                            className={
                                categoriaSeleccionada === categoria.codigo
                                    ? 'categoria-activa'
                                    : ''
                            }
                            aria-current={
                                categoriaSeleccionada === categoria.codigo
                                    ? 'page'
                                    : undefined
                            }
                            onClick={evento => {
                                evento.preventDefault()
                                cambiarCategoria(categoria.codigo)
                            }}
                        >
                            {categoria.nombre}
                        </a>
                    ))}
                </nav>

                {!cargando && !error && (
                    <p
                        role="status"
                        aria-live="polite"
                        className="visually-hidden"
                    >
                        {productosFiltrados.length}
                        {productosFiltrados.length === 1
                            ? ' producto encontrado'
                            : ' productos encontrados'}
                    </p>
                )}

                <p role="status" aria-live="polite">{mensajeCarrito}</p>

                {cargando ? (
                    <p role="status" aria-live="polite">
                        Cargando productos...
                    </p>
                ) : error ? (
                    <div role="alert">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={reintentarCarga}
                        >
                            Reintentar
                        </button>
                    </div>
                ) : productosFiltrados.length > 0 ? (
                    <section
                        id="productos-completos"
                        aria-label="Listado de productos"
                    >
                        {productosFiltrados.map(producto => (
                            <TarjetaProducto
                                key={producto.codigo}
                                producto={producto}
                                variante="catalogo"
                                onAgregar={manejarAgregar}
                            />
                        ))}
                    </section>
                ) : (
                    <p role="status">
                        No se encontraron productos para esta búsqueda.
                    </p>
                )}

                <details className="mt-4 mb-4">
                    <summary>Buscar productos por nombre</summary>

                    <div className="mt-3">
                        <label
                            htmlFor="buscar-producto-catalogo"
                            className="form-label"
                        >
                            Buscar productos
                        </label>

                        <input
                            id="buscar-producto-catalogo"
                            className="form-control"
                            type="search"
                            placeholder="Buscar producto..."
                            value={busqueda}
                            onChange={cambiarBusqueda}
                        />
                    </div>
                </details>
            </section>
        </main>
    )
}

export default Catalogo
