// Organismo: listado de usuarios del panel de administración, con buscador y filtro por rol.
// En la Ev1 esto lo hacía usuarios-admin.js armando cada fila con innerHTML.
// Ahora recibe la lista por props y la dibuja con .map().
import { useState } from 'react'
import { Link } from 'react-router'
import { formatearRun } from '../../utils/validaciones'

const ROLES = ['Cliente', 'Vendedor', 'Administrador']

// Clase CSS de la insignia según el rol (las mismas de la Ev1)
function claseRol(rol) {
    if (rol === 'Administrador') return 'rol rol-administrador'
    if (rol === 'Vendedor') return 'rol rol-vendedor'
    return 'rol rol-cliente'
}

// Iniciales para el avatar: "José Cardoza" → "JC"
function iniciales(usuario) {
    return `${usuario.nombre?.[0] ?? ''}${usuario.apellidos?.[0] ?? ''}`.toUpperCase() || '?'
}

function TablaUsuarios({ usuarios = [], children }) {
    const [busqueda, setBusqueda] = useState('')
    const [rol, setRol] = useState('Todos')

    // Se filtra en cada dibujo: por nombre, correo o RUN, y por rol
    const texto = busqueda.trim().toLowerCase()
    const visibles = usuarios.filter((usuario) => {
        const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellidos ?? ''}`.toLowerCase()
        const coincideTexto =
            nombreCompleto.includes(texto) ||
            (usuario.correo ?? '').toLowerCase().includes(texto) ||
            (usuario.run ?? '').toLowerCase().includes(texto)
        const coincideRol = rol === 'Todos' || usuario.tipoUsuario === rol
        return coincideTexto && coincideRol
    })

    const hayFiltros = texto !== '' || rol !== 'Todos'

    function limpiarFiltros() {
        setBusqueda('')
        setRol('Todos')
    }

    return (
        <>
            {/* HERRAMIENTAS: buscador y filtro */}
            <section id="usuarios-herramientas" className="panel herramientas-admin">
                <section id="usuarios-buscador" className="buscador-admin">
                    <span aria-hidden="true">🔍</span>
                    <input
                        type="search"
                        id="buscar-usuario"
                        placeholder="Buscar por nombre, RUN o correo..."
                        aria-label="Buscar usuario"
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                    />
                </section>

                <section id="usuarios-filtro" className="filtro-admin">
                    <label htmlFor="filtro-rol">Filtrar por rol:</label>
                    <select
                        id="filtro-rol"
                        className="control-formulario"
                        value={rol}
                        onChange={(evento) => setRol(evento.target.value)}
                    >
                        <option value="Todos">Todos los roles</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Acción extra que manda la página (por ejemplo, el botón "Nuevo usuario") */}
                {children}
            </section>

            {/* LISTADO */}
            <section id="usuarios-listado" className="panel listado-admin">
                <section id="usuarios-listado-header" className="listado-cabecera">
                    <h2>Usuarios registrados</h2>
                    <p id="cantidad-usuarios">Mostrando {visibles.length} usuario(s)</p>
                </section>

                {visibles.length === 0 ? (
                    <section id="mensaje-sin-usuarios" className="mensaje-listado-vacio estado-vacio">
                        <span className="estado-vacio-icono" aria-hidden="true">👥</span>
                        <p>{hayFiltros ? 'Ningún usuario coincide con la búsqueda.' : 'No existen usuarios registrados.'}</p>
                        {hayFiltros && (
                            <button type="button" className="btn btn-secundario" onClick={limpiarFiltros}>
                                Limpiar filtros
                            </button>
                        )}
                    </section>
                ) : (
                    <section id="tabla-contenedor" className="tabla-contenedor">
                        <table id="tabla-usuarios" className="tabla-admin tabla-usuarios">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>RUN</th>
                                    <th>Región</th>
                                    <th>Comuna</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibles.map((usuario) => (
                                    <tr key={usuario.run || usuario.correo}>
                                        {/* data-label: en celular cada fila se muestra como tarjeta con su etiqueta */}
                                        <td data-label="Usuario">
                                            <span className="celda-usuario">
                                                <span className="avatar-usuario" aria-hidden="true">
                                                    {iniciales(usuario)}
                                                </span>
                                                <span>
                                                    <strong>
                                                        {usuario.nombre} {usuario.apellidos}
                                                    </strong>
                                                    <small>{usuario.correo || '-'}</small>
                                                </span>
                                            </span>
                                        </td>
                                        <td data-label="RUN">{formatearRun(usuario.run)}</td>
                                        <td data-label="Región">{usuario.region || '-'}</td>
                                        <td data-label="Comuna">{usuario.comuna || '-'}</td>
                                        <td data-label="Rol">
                                            <span className={claseRol(usuario.tipoUsuario)}>
                                                {usuario.tipoUsuario || 'Cliente'}
                                            </span>
                                        </td>
                                        <td data-label="Acciones">
                                            <span className="acciones-tabla">
                                                <Link className="boton-ver" to={`/admin/usuarios/${usuario.run}`}>
                                                    👁 Ver
                                                </Link>
                                                <Link className="boton-editar" to={`/admin/usuarios/${usuario.run}/editar`}>
                                                    ✏ Editar
                                                </Link>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </section>
        </>
    )
}

export default TablaUsuarios