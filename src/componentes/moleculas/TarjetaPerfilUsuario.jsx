// Molécula: vista previa del usuario que se está creando o editando.
// Se actualiza mientras el administrador escribe (los datos llegan por props desde la página).
import { obtenerIniciales, claseRol, formatearFecha, ETIQUETAS_CAMPOS } from '../../utils/usuarios'

// Campos que cuentan para el progreso en modo "nuevo"
const CAMPOS_OBLIGATORIOS = ['run', 'tipoUsuario', 'nombre', 'apellidos', 'correo', 'region', 'comuna', 'direccion', 'contrasena', 'confirmarContrasena']

function TarjetaPerfilUsuario({ usuario = {}, modo = 'editar', cambios = [] }) {
    const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellidos ?? ''}`.trim()
    const completos = CAMPOS_OBLIGATORIOS.filter((campo) => String(usuario[campo] ?? '').trim() !== '').length
    const porcentaje = Math.round((completos / CAMPOS_OBLIGATORIOS.length) * 100)

    const datos = [
        { icono: '✉️', texto: usuario.correo || 'Sin correo' },
        { icono: '📍', texto: usuario.comuna ? `${usuario.comuna}, ${usuario.region}` : 'Sin ubicación' },
        { icono: '🎂', texto: usuario.fechaNacimiento ? formatearFecha(usuario.fechaNacimiento) : 'Sin fecha de nacimiento' },
    ]

    return (
        <aside className="panel tarjeta-perfil-editor" aria-label="Vista previa del usuario">
            <div className="perfil-editor-portada" aria-hidden="true" />

            <div className="perfil-editor-cuerpo">
                <span className="perfil-editor-avatar" aria-hidden="true">
                    {nombreCompleto ? obtenerIniciales(usuario) : '👤'}
                </span>
                <h3>{nombreCompleto || 'Nombre del usuario'}</h3>
                {usuario.tipoUsuario ? (
                    <span className={claseRol(usuario.tipoUsuario)}>{usuario.tipoUsuario}</span>
                ) : (
                    <span className="rol rol-sin-asignar">Sin rol</span>
                )}

                <ul className="perfil-editor-datos">
                    {datos.map((dato) => (
                        <li key={dato.icono}>
                            <span aria-hidden="true">{dato.icono}</span>
                            {dato.texto}
                        </li>
                    ))}
                </ul>

                {/* ESTADO: en editar, los cambios sin guardar; en nuevo, el avance del formulario */}
                <section className="perfil-editor-estado">
                    {modo === 'editar' ? (
                        <>
                            <h4>Cambios sin guardar</h4>
                            {cambios.length === 0 ? (
                                <p>✅ Todo está al día.</p>
                            ) : (
                                <p>
                                    {cambios.map((campo) => (
                                        <span key={campo} className="chip-cambio">
                                            {ETIQUETAS_CAMPOS[campo]}
                                        </span>
                                    ))}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <h4>Formulario completo al {porcentaje}%</h4>
                            <div className="barra-progreso" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
                                <span style={{ width: `${porcentaje}%` }} />
                            </div>
                        </>
                    )}
                </section>
            </div>
        </aside>
    )
}

export default TarjetaPerfilUsuario