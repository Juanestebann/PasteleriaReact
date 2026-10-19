// Organismo: listado de usuarios del panel de administración, con buscador y filtro por rol.
// En la Ev1 esto lo hacía usuarios-admin.js armando cada fila con innerHTML.
// Ahora recibe la lista por props y la dibuja con .map().
import { useState } from 'react'
import { Link } from 'react-router'

const ROLES = ['Cliente', 'Vendedor', 'Administrador']

// Clase CSS de la insignia según el rol (las mismas de la Ev1)
function claseRol(rol) {
    if (rol === 'Administrador') return 'rol rol-administrador'
    if (rol === 'Vendedor') return 'rol rol-vendedor'
    return 'rol rol-cliente'
}

function TablaUsuarios({ usuarios = [] }) {
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

    return (
        <>
            {/* HERRAMIENTAS: buscador y filtro */}
            <section id="usuarios-herramientas" className="panel herramientas-admin">
                <section id="usuarios-buscador" className="buscador-admin">
                    <span aria-hidden="true">🔍</span>
                    <input
                        type="search"
                        id="buscar-usuario"
                        placeholder="Buscar usuario..."
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
            </section>

            {/* LISTADO */}
            <section id="usuarios-listado" className="panel listado-admin">
                <section id="usuarios-listado-header" className="listado-cabecera">
                    <h2>Usuarios registrados</h2>
                    <p id="cantidad-usuarios">Mostrando {visibles.length} usuario(s)</p>
                </section>

                {visibles.length === 0 ? (
                    <p id="mensaje-sin-usuarios" className="mensaje-listado-vacio">
                        No existen usuarios registrados.
                    </p>
                ) : (
                    <section id="tabla-contenedor" className="tabla-contenedor">
                        <table id="tabla-usuarios" className="tabla-admin">
                            <thead>
                                <tr>
                                    <th>RUN</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Región</th>
                                    <th>Comuna</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibles.map((usuario) => (
                                    <tr key={usuario.run || usuario.correo}>
                                        <td>{usuario.run || '-'}</td>
                                        <td>
                                            {usuario.nombre} {usuario.apellidos}
                                        </td>
                                        <td>{usuario.correo || '-'}</td>
                                        <td>{usuario.region || '-'}</td>
                                        <td>{usuario.comuna || '-'}</td>
                                        <td>
                                            <span className={claseRol(usuario.tipoUsuario)}>
                                                {usuario.tipoUsuario || 'Cliente'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link className="boton-ver" to={`/admin/usuarios/${usuario.run}`}>
                                                👁 Ver
                                            </Link>
                                            <Link className="boton-editar" to={`/admin/usuarios/${usuario.run}/editar`}>
                                                ✏ Editar
                                            </Link>
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