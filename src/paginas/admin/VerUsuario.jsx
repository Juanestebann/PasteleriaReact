// Página del administrador: detalle de un usuario (/admin/usuarios/:run).
// En la Ev1 era ver-usuario.html, que buscaba al usuario por ?correo= en la URL
// y llenaba cada dato con textContent. Ahora se busca por el RUN de la ruta y se dibuja con JSX.
import { Link, useParams } from 'react-router'
import { formatearRun } from '../../utils/validaciones'
import { obtenerIniciales, claseRol, formatearFecha } from '../../utils/usuarios'

function VerUsuario({ usuarios = [] }) {
    const { run } = useParams()
    const usuario = usuarios.find((u) => u.run === run)

    const presentacion = (
        <section
            id="ver-usuario-presentacion"
            className="panel panel-presentacion presentacion-acciones presentacion-usuarios"
        >
            <section>
                <h2>Información del usuario</h2>
                <p>Consulta los datos registrados del usuario seleccionado.</p>
            </section>
            <Link id="boton-volver" to="/admin/usuarios" className="btn btn-admin btn-secundario">
                ← Volver
            </Link>
        </section>
    )

    // El RUN de la URL no existe en la lista
    if (!usuario) {
        return (
            <>
                {presentacion}
                <section id="mensaje-usuario-no-encontrado" className="panel mensaje-vacio mensaje-vacio-visible">
                    <span className="estado-vacio-icono" aria-hidden="true">⚠️</span>
                    <h3>Usuario no encontrado</h3>
                    <p>No fue posible encontrar la información del usuario solicitado.</p>
                    <Link to="/admin/usuarios">Volver al listado</Link>
                </section>
            </>
        )
    }

    const rol = usuario.tipoUsuario || 'Cliente'

    // Cada dato es una tarjeta; antes eran 7 bloques HTML casi iguales, ahora un arreglo y un .map()
    const datos = [
        { etiqueta: 'RUN', valor: formatearRun(usuario.run), icono: '🪪' },
        { etiqueta: 'Correo electrónico', valor: usuario.correo, icono: '✉️' },
        { etiqueta: 'Fecha de nacimiento', valor: formatearFecha(usuario.fechaNacimiento), icono: '🎂' },
        { etiqueta: 'Rol', valor: rol, icono: '👤' },
        { etiqueta: 'Región', valor: usuario.region, icono: '🗺️' },
        { etiqueta: 'Comuna', valor: usuario.comuna, icono: '📍' },
        { etiqueta: 'Dirección', valor: usuario.direccion, icono: '🏠', anchoCompleto: true },
    ]

    return (
        <>
            {presentacion}

            <section id="tarjeta-ver-usuario" className="panel panel-con-borde">
                {/* PERFIL */}
                <section id="perfil-ver-usuario">
                    <section id="avatar-usuario" aria-hidden="true">
                        {obtenerIniciales(usuario)}
                    </section>
                    <section>
                        <h2 id="nombre-usuario">
                            {usuario.nombre} {usuario.apellidos}
                        </h2>
                        <span id="rol-usuario" className={claseRol(rol)}>
                            {rol}
                        </span>
                    </section>
                </section>

                {/* DATOS */}
                <section id="datos-usuario">
                    {datos.map((dato) => (
                        <section
                            key={dato.etiqueta}
                            className={dato.anchoCompleto ? 'dato-usuario dato-ancho-completo' : 'dato-usuario'}
                        >
                            <span className="dato-etiqueta">
                                <span aria-hidden="true">{dato.icono}</span> {dato.etiqueta}
                            </span>
                            <p>{dato.valor || '-'}</p>
                        </section>
                    ))}
                </section>

                {/* ACCIONES */}
                <section id="acciones-ver-usuario">
                    <Link
                        id="boton-editar-usuario"
                        to={`/admin/usuarios/${usuario.run}/editar`}
                        className="btn btn-admin btn-principal"
                    >
                        ✏️ Editar usuario
                    </Link>
                </section>
            </section>
        </>
    )
}

export default VerUsuario