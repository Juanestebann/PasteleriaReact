// Página del administrador para crear y editar usuarios.
//   /admin/usuarios/nuevo        → modo 'nuevo'
//   /admin/usuarios/:run/editar  → modo 'editar' (busca al usuario por el RUN de la URL)
// En la Ev1 eran dos páginas (nuevo-usuario.html y editar-usuario.html) con su propio JS.
// Ahora es una sola página que reutiliza FormularioUsuario.
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import TarjetaPerfilUsuario from '../../componentes/moleculas/TarjetaPerfilUsuario'
import { camposModificados } from '../../utils/usuarios'

// Texto de cada modo (títulos, botón y mensaje), con los mismos ids de la Ev1
const textosPorModo = {
    nuevo: {
        idPresentacion: 'nuevo-usuario-presentacion',
        idTarjeta: 'tarjeta-nuevo-usuario',
        titulo: 'Nuevo usuario',
        descripcion: 'Registra un nuevo usuario en el sistema.',
        textoBoton: 'Crear usuario',
        mensajeExito: 'Usuario creado correctamente.',
    },
    editar: {
        idPresentacion: 'editar-usuario-presentacion',
        idTarjeta: 'tarjeta-editar-usuario',
        titulo: 'Editar usuario',
        descripcion: 'Modifica los datos del usuario seleccionado.',
        textoBoton: 'Guardar cambios',
        mensajeExito: 'Usuario actualizado correctamente.',
    },
}

function EditorUsuario({ usuarios = [], onCrear, onActualizar }) {
    const { run } = useParams()
    const navegar = useNavigate()
    const [runGuardado, setRunGuardado] = useState(null)
    // Datos que el administrador va escribiendo (para la vista previa)
    const [vistaPrevia, setVistaPrevia] = useState({})

    // Si la URL trae :run estamos editando; si no, creando
    const modo = run ? 'editar' : 'nuevo'
    const textos = textosPorModo[modo]
    const usuarioEditado = modo === 'editar' ? usuarios.find((usuario) => usuario.run === run) : null

    // Igual que la Ev1: después de guardar se muestra el mensaje y a los 1,2 s se va al detalle
    useEffect(() => {
        if (!runGuardado) return
        const temporizador = setTimeout(() => navegar(`/admin/usuarios/${runGuardado}`), 1200)
        return () => clearTimeout(temporizador)
    }, [runGuardado, navegar])

    function guardar(usuario) {
        if (modo === 'editar') onActualizar(usuario)
        else onCrear(usuario)
        setRunGuardado(usuario.run)
    }

    const presentacion = (
        <section
            id={textos.idPresentacion}
            className="panel panel-presentacion presentacion-acciones presentacion-usuarios"
        >
            <section>
                <h2>{textos.titulo}</h2>
                <p>{textos.descripcion}</p>
            </section>
            <Link id="boton-volver" to="/admin/usuarios" className="btn btn-admin btn-secundario">
                ← Volver
            </Link>
        </section>
    )

    // El RUN de la URL no existe en la lista
    if (modo === 'editar' && !usuarioEditado) {
        return (
            <>
                {presentacion}
                <section id="mensaje-usuario-no-encontrado" className="panel mensaje-vacio mensaje-vacio-visible">
                    <span className="estado-vacio-icono" aria-hidden="true">⚠️</span>
                    <h3>Usuario no encontrado</h3>
                    <p>No fue posible encontrar el usuario seleccionado.</p>
                    <Link to="/admin/usuarios">Volver al listado</Link>
                </section>
            </>
        )
    }

    return (
        <>
            {presentacion}

            <section className="editor-usuario-grid">
                {/* Vista previa que cambia mientras se escribe */}
                <TarjetaPerfilUsuario
                    usuario={vistaPrevia}
                    modo={modo}
                    cambios={camposModificados(usuarioEditado, vistaPrevia)}
                />

                <section id={textos.idTarjeta} className="panel panel-con-borde">
                    {/* key: si cambia el RUN de la URL, el formulario parte de nuevo con los datos correctos */}
                    <FormularioUsuario
                        key={run ?? 'nuevo'}
                        modo={modo}
                        usuarioInicial={usuarioEditado}
                        usuariosExistentes={usuarios}
                        onGuardar={guardar}
                        onCancelar={() => navegar('/admin/usuarios')}
                        textoBoton={textos.textoBoton}
                        mensajeExito={textos.mensajeExito}
                        onCambio={setVistaPrevia}
                    />
                </section>
            </section>
        </>
    )
}

export default EditorUsuario