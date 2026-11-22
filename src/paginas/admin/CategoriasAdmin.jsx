
import { useEffect, useState } from 'react'
import {
    obtenerCategorias,
    crearCategoriaApi,
    actualizarCategoriaApi,
    eliminarCategoriaApi
} from '../../servicios/categorias'

const formularioInicial = {
    slug: '',
    nombre: ''
}

const separacion = {
    marginBottom: '1.5rem'
}

function CategoriasAdmin() {
    const [categorias, setCategorias] = useState([])
    const [formulario, setFormulario] = useState(formularioInicial)
    const [categoriaEditando, setCategoriaEditando] = useState(null)

    const [cargando, setCargando] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [eliminandoId, setEliminandoId] = useState(null)

    const [errorCarga, setErrorCarga] = useState('')
    const [errorFormulario, setErrorFormulario] = useState('')
    const [errorEliminacion, setErrorEliminacion] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [erroresFormulario, setErroresFormulario] = useState({})
    const [intentos, setIntentos] = useState(0)

    const modoEdicion = categoriaEditando !== null

    // C3-09: carga las categorías reales desde Spring Boot.
    useEffect(() => {
        let activo = true

        async function cargarCategorias() {
            setCargando(true)
            setErrorCarga('')

            try {
                const respuesta = await obtenerCategorias()

                if (!activo) return

                if (!Array.isArray(respuesta)) {
                    throw new Error('Respuesta de categorías inválida')
                }

                setCategorias(respuesta)
            } catch (error) {
                if (!activo) return

                console.error(
                    'No se pudieron cargar las categorías:',
                    error
                )

                setErrorCarga(
                    'No se pudieron cargar las categorías.'
                )
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        cargarCategorias()

        return () => {
            activo = false
        }
    }, [intentos])

    function limpiarFormulario() {
        setFormulario(formularioInicial)
        setCategoriaEditando(null)
        setErroresFormulario({})
    }

    function limpiarMensajes() {
        setErrorFormulario('')
        setErrorEliminacion('')
        setMensaje('')
    }

    function cambiarCampo(evento) {
        const { name, value } = evento.target

        setFormulario(actual => ({
            ...actual,
            [name]: value
        }))

        setErroresFormulario(actual => ({
            ...actual,
            [name]: ''
        }))

        limpiarMensajes()
    }

    function generarSlug(nombre) {
        return nombre
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }

    function validarFormulario() {
        const errores = {}

        const nombre = formulario.nombre.trim()
        const slug = formulario.slug.trim()

        if (!nombre) {
            errores.nombre = 'El nombre es obligatorio.'
        }

        if (!slug) {
            errores.slug = 'El identificador es obligatorio.'
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
            errores.slug =
                'Utiliza letras minúsculas, números y guiones.'
        }

        const nombreDuplicado = categorias.some(categoria =>
            categoria.id !== categoriaEditando?.id &&
            categoria.nombre.trim().toLowerCase() ===
            nombre.toLowerCase()
        )

        if (nombre && nombreDuplicado) {
            errores.nombre =
                'Ya existe una categoría con ese nombre.'
        }

        const slugDuplicado = categorias.some(categoria =>
            categoria.id !== categoriaEditando?.id &&
            categoria.slug === slug
        )

        if (slug && slugDuplicado) {
            errores.slug =
                'Ya existe una categoría con ese identificador.'
        }

        setErroresFormulario(errores)

        return Object.keys(errores).length === 0
    }

    function editarCategoria(categoria) {
        setCategoriaEditando(categoria)

        setFormulario({
            slug: categoria.slug,
            nombre: categoria.nombre
        })

        setErroresFormulario({})
        limpiarMensajes()
    }

    async function guardarCategoria(evento) {
        evento.preventDefault()

        if (guardando || !validarFormulario()) {
            return
        }

        setGuardando(true)
        limpiarMensajes()

        const datos = {
            slug: formulario.slug.trim(),
            nombre: formulario.nombre.trim()
        }

        try {
            if (modoEdicion) {
                await actualizarCategoriaApi(
                    categoriaEditando.id,
                    datos
                )
            } else {
                await crearCategoriaApi(datos)
            }

            const actualizadas = await obtenerCategorias()

            if (!Array.isArray(actualizadas)) {
                throw new Error(
                    'Respuesta de categorías inválida'
                )
            }

            setCategorias(actualizadas)
            limpiarFormulario()

            setMensaje(
                modoEdicion
                    ? 'Categoría actualizada correctamente.'
                    : 'Categoría creada correctamente.'
            )
        } catch (error) {
            console.error(
                'No se pudo guardar la categoría:',
                error
            )

            const estado = error.response?.status
            const mensajeServidor = error.response?.data?.mensaje

            if (estado === 400) {
                setErrorFormulario(
                    mensajeServidor ||
                    'Revisa los datos ingresados en el formulario.'
                )
            } else if (estado === 409) {
                setErrorFormulario(
                    mensajeServidor ||
                    'Ya existe una categoría con ese nombre o identificador.'
                )
            } else if (estado === 403) {
                setErrorFormulario(
                    'No tienes permisos para administrar categorías.'
                )
            } else {
                setErrorFormulario(
                    'No se pudo guardar la categoría. Inténtalo nuevamente.'
                )
            }
        } finally {
            setGuardando(false)
        }
    }

    async function eliminarCategoria(categoria) {
        if (eliminandoId !== null || guardando) {
            return
        }

        const confirmado = window.confirm(
            `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`
        )

        if (!confirmado) return

        setEliminandoId(categoria.id)
        limpiarMensajes()

        try {
            await eliminarCategoriaApi(categoria.id)

            setCategorias(actuales =>
                actuales.filter(actual =>
                    actual.id !== categoria.id
                )
            )

            if (categoriaEditando?.id === categoria.id) {
                limpiarFormulario()
            }

            setMensaje(
                'Categoría eliminada correctamente.'
            )
        } catch (error) {
            console.error(
                'No se pudo eliminar la categoría:',
                error
            )

            const estado = error.response?.status
            const mensajeServidor = error.response?.data?.mensaje

            if (estado === 409) {
                setErrorEliminacion(
                    mensajeServidor ||
                    'No se puede eliminar esta categoría porque tiene productos asociados.'
                )
            } else if (estado === 403) {
                setErrorEliminacion(
                    'No tienes permisos para eliminar categorías.'
                )
            } else if (estado === 404) {
                setErrorEliminacion(
                    'La categoría ya no existe en el servidor.'
                )
            } else {
                setErrorEliminacion(
                    'No se pudo eliminar la categoría. Inténtalo nuevamente.'
                )
            }
        } finally {
            setEliminandoId(null)
        }
    }

    return (
        <div className="productos-admin-react">
            <section
                id="categorias-presentacion"
                className="panel panel-presentacion"
                style={separacion}
            >
                <h2>Administración de categorías</h2>

                <p>
                    Consulta, registra, modifica y elimina las
                    categorías de productos disponibles en la pastelería.
                </p>
            </section>

            <section
                id="categorias-resumen"
                aria-label="Resumen de categorías"
                style={separacion}
            >
                <article className="panel producto-resumen">
                    <span
                        className="resumen-icono"
                        aria-hidden="true"
                    >
                        🗂️
                    </span>

                    <div>
                        <h3>Total de categorías</h3>
                        <p>{categorias.length}</p>
                    </div>
                </article>
            </section>

            <section
                id="formulario-categorias"
                className="panel listado-productos-admin"
                style={{
                    ...separacion,
                    padding: '1.5rem'
                }}
            >
                <h2>
                    {modoEdicion
                        ? 'Editar categoría'
                        : 'Nueva categoría'}
                </h2>

                <p>
                    {modoEdicion
                        ? 'Modifica los datos de la categoría seleccionada.'
                        : 'Registra una categoría para organizar los productos.'}
                </p>

                {errorFormulario && (
                    <div
                        role="alert"
                        style={{ margin: '1rem 0' }}
                    >
                        <p>{errorFormulario}</p>
                    </div>
                )}

                <form onSubmit={guardarCategoria} noValidate>
                    <div
                        className="campo-formulario"
                        style={{ marginBottom: '1rem' }}
                    >
                        <label
                            htmlFor="nombre-categoria"
                            className="form-label"
                        >
                            Nombre de la categoría
                        </label>

                        <input
                            id="nombre-categoria"
                            name="nombre"
                            type="text"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={cambiarCampo}
                            placeholder="Ej: Pastelería artesanal"
                            aria-invalid={
                                Boolean(erroresFormulario.nombre)
                            }
                            disabled={guardando}
                        />

                        {erroresFormulario.nombre && (
                            <p role="alert">
                                {erroresFormulario.nombre}
                            </p>
                        )}
                    </div>

                    <div
                        className="campo-formulario"
                        style={{ marginBottom: '1rem' }}
                    >
                        <label
                            htmlFor="slug-categoria"
                            className="form-label"
                        >
                            Identificador de la categoría
                        </label>

                        <input
                            id="slug-categoria"
                            name="slug"
                            type="text"
                            className="form-control"
                            value={formulario.slug}
                            onChange={cambiarCampo}
                            placeholder="Ej: pasteleria-artesanal"
                            aria-invalid={
                                Boolean(erroresFormulario.slug)
                            }
                            disabled={guardando || modoEdicion}
                        />

                        {erroresFormulario.slug && (
                            <p role="alert">
                                {erroresFormulario.slug}
                            </p>
                        )}

                        <p>
                            El identificador se utiliza para
                            clasificar los productos y construir
                            los filtros del catálogo.
                        </p>
                    </div>

                    {!modoEdicion && (
                        <button
                            type="button"
                            className="btn btn-secundario"
                            disabled={guardando}
                            onClick={() => {
                                setFormulario(actual => ({
                                    ...actual,
                                    slug: generarSlug(
                                        actual.nombre
                                    )
                                }))

                                setErroresFormulario(actual => ({
                                    ...actual,
                                    slug: ''
                                }))
                            }}
                        >
                            Generar identificador
                        </button>
                    )}

                    <div
                        className="acciones-formulario-producto"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginTop: '1.25rem'
                        }}
                    >
                        <button
                            type="submit"
                            className="btn btn-principal"
                            disabled={
                                guardando ||
                                eliminandoId !== null
                            }
                        >
                            {guardando
                                ? 'Guardando...'
                                : modoEdicion
                                    ? 'Guardar cambios'
                                    : 'Crear categoría'}
                        </button>

                        {modoEdicion && (
                            <button
                                type="button"
                                className="btn btn-secundario"
                                onClick={limpiarFormulario}
                                disabled={guardando}
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section
                id="listado-categorias"
                className="panel listado-productos-admin"
                style={{ padding: '1.5rem' }}
            >
                <div
                    id="categorias-listado-header"
                    style={{ marginBottom: '1rem' }}
                >
                    <h2>Categorías registradas</h2>

                    <p>
                        Categorías disponibles en el sistema.
                    </p>
                </div>

                {/* Los errores de eliminación se muestran
                    junto a la tabla y no sobre el formulario. */}
                {errorEliminacion && (
                    <div
                        role="alert"
                        style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            borderLeft: '4px solid #b91c1c',
                            backgroundColor: '#fff5f5',
                            borderRadius: '0.25rem'
                        }}
                    >
                        {errorEliminacion}
                    </div>
                )}

                {mensaje && (
                    <div
                        role="status"
                        style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            borderLeft: '4px solid #D89B2B',
                            backgroundColor: '#FFF5E1',
                            borderRadius: '0.25rem'
                        }}
                    >
                        {mensaje}
                    </div>
                )}

                {/* Reintentar solo aparece si falla
                    la consulta inicial de categorías. */}
                {errorCarga && (
                    <div
                        role="alert"
                        style={{ marginBottom: '1rem' }}
                    >
                        <p>{errorCarga}</p>

                        <button
                            type="button"
                            className="btn btn-principal"
                            onClick={() =>
                                setIntentos(actual => actual + 1)
                            }
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {cargando ? (
                    <p role="status">
                        Cargando categorías...
                    </p>
                ) : (
                    <>
                        <div
                            className="tabla-contenedor"
                            style={{ overflowX: 'auto' }}
                        >
                            <table
                                id="tabla-categorias"
                                className="tabla-admin"
                            >
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Identificador</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>

                                <tbody>
                                {categorias.map(categoria => (
                                    <tr key={categoria.id}>
                                        <td>
                                            {categoria.id}
                                        </td>

                                        <td>
                                            {categoria.nombre}
                                        </td>

                                        <td>
                                            {categoria.slug}
                                        </td>

                                        <td>
                                            <div
                                                className="celda-acciones"
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-principal"
                                                    onClick={() =>
                                                        editarCategoria(
                                                            categoria
                                                        )
                                                    }
                                                    disabled={
                                                        guardando ||
                                                        eliminandoId !== null
                                                    }
                                                    aria-label={
                                                        `Editar ${categoria.nombre}`
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-eliminar-producto"
                                                    onClick={() =>
                                                        eliminarCategoria(
                                                            categoria
                                                        )
                                                    }
                                                    disabled={
                                                        guardando ||
                                                        eliminandoId !== null
                                                    }
                                                    aria-label={
                                                        `Eliminar ${categoria.nombre}`
                                                    }
                                                >
                                                    {eliminandoId === categoria.id
                                                        ? 'Eliminando...'
                                                        : 'Eliminar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {!errorCarga &&
                            categorias.length === 0 && (
                                <p role="status">
                                    No hay categorías registradas.
                                </p>
                            )}
                    </>
                )}
            </section>
        </div>
    )
}

export default CategoriasAdmin
