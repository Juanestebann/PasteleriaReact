
import { useState } from 'react'
import { Link } from 'react-router'
import { productosIniciales } from '../../datos/productos'

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
    productos = productosIniciales,
    puedeGestionar = true,
    onEliminar
}) {
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState('todos')

    function confirmarEliminacion(producto) {
        if (!puedeGestionar || typeof onEliminar !== 'function') {
            return
        }

        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar el producto ${producto.nombre} (${producto.codigo})?`
        )

        if (confirmado) {
            onEliminar(producto.codigo)
        }
    }

    const totalProductos = productos.length

    const productosCriticos = productos.filter(
        (producto) => producto.stock <= producto.stockCritico
    ).length

    const categorias = [
        ...new Set(productos.map((producto) => producto.categoria))
    ]

    const productosFiltrados = productos.filter((producto) => {
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
                        onChange={(evento) =>
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
                        onChange={(evento) =>
                            setFiltro(evento.target.value)
                        }
                    >
                        <option value="todos">
                            Todas las categorías
                        </option>

                        <option value="criticos">
                            Stock crítico
                        </option>

                        {categorias.map((categoria) => (
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

            <section className="panel listado-productos-admin">
                <div id="productos-listado-header">
                    <h2>Productos registrados</h2>
                    <p>Inventario disponible en el sistema.</p>
                </div>

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
                            {productosFiltrados.map((producto) => {
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

                                        <td>{producto.codigo}</td>

                                        <td>{producto.nombre}</td>

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

                                        <td>{producto.stock}</td>

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
                                                            onClick={() =>
                                                                confirmarEliminacion(producto)
                                                            }
                                                        >
                                                            Eliminar
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

                {productosFiltrados.length === 0 && (
                    <p role="status">
                        No se encontraron productos.
                    </p>
                )}
            </section>
        </div>
    )
}

export default ProductosAdmin
