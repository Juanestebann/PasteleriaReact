// Página del administrador: gestión de usuarios (/admin/usuarios).
// Solo el Administrador puede entrar (lo controla RutaProtegida en App.jsx).
// S3-10: la lista se pide a la API (GET /api/v1/usuarios) al abrir la página,
// con 3 estados: cargando, error (con Reintentar) y datos.
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import TablaUsuarios from '../../componentes/organismos/TablaUsuarios'
import { listarUsuarios, eliminarUsuario } from '../../servicios/usuarios'
import { mensajeDeError } from '../../servicios/errores'

function UsuariosAdmin({ sesion }) {
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0) // al sumar 1, el useEffect vuelve a pedir la lista
    const [runEliminando, setRunEliminando] = useState(null)
    const [mensajeAccion, setMensajeAccion] = useState({ tipo: '', texto: '' })

    // Carga la lista al abrir la página (y cada vez que se presiona Reintentar)
    useEffect(() => {
        let ignorar = false // si el usuario sale antes de que llegue la respuesta, se descarta

        async function cargar() {
            setCargando(true)
            setError('')
            try {
                const lista = await listarUsuarios()
                if (!ignorar) setUsuarios(lista)
            } catch (err) {
                if (!ignorar) setError(mensajeDeError(err))
            } finally {
                if (!ignorar) setCargando(false)
            }
        }

        cargar()
        return () => {
            ignorar = true
        }
    }, [intento])

    // Eliminar: se confirma, se llama a la API y, si responde 204, se quita la fila sin volver a pedir la lista
    async function eliminar(usuario) {
        const confirmado = window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}? Esta acción no se puede deshacer.`)
        if (!confirmado) return

        setRunEliminando(usuario.run)
        setMensajeAccion({ tipo: '', texto: '' })
        try {
            await eliminarUsuario(usuario.run)
            setUsuarios((actuales) => actuales.filter((u) => u.run !== usuario.run))
            setMensajeAccion({ tipo: 'exito', texto: `Se eliminó a ${usuario.nombre} ${usuario.apellidos}.` })
        } catch (err) {
            // 409: el administrador intentó eliminarse a sí mismo, o el usuario tiene boletas
            setMensajeAccion({ tipo: 'error', texto: mensajeDeError(err) })
        } finally {
            setRunEliminando(null)
        }
    }

    // Contadores para las tarjetas de resumen (mismo patrón que "Total productos" de la Ev1)
    const contar = (rol) => usuarios.filter((usuario) => usuario.tipoUsuario === rol).length
    const resumen = [
        { titulo: 'Total usuarios', valor: usuarios.length, icono: '👥' },
        { titulo: 'Clientes', valor: contar('Cliente'), icono: '🧁' },
        { titulo: 'Vendedores', valor: contar('Vendedor'), icono: '🛍️' },
        { titulo: 'Administradores', valor: contar('Administrador'), icono: '🛡️' },
    ]

    const presentacion = (
        <section id="usuarios-presentacion" className="panel panel-presentacion">
            <h2>Gestión de usuarios</h2>
            <p>Como Administrador puedes ver, crear, editar y eliminar los usuarios registrados en el sistema.</p>
        </section>
    )

    // ESTADO 1: cargando
    if (cargando) {
        return (
            <>
                {presentacion}
                <section className="panel mensaje-vacio mensaje-vacio-visible" role="status">
                    <h3>Cargando usuarios…</h3>
                </section>
            </>
        )
    }

    // ESTADO 2: error (API apagada, sesión vencida, etc.)
    if (error) {
        return (
            <>
                {presentacion}
                <section className="panel mensaje-vacio mensaje-vacio-visible">
                    <h3>No se pudieron cargar los usuarios</h3>
                    <p role="alert">{error}</p>
                    <button type="button" className="btn btn-admin btn-principal" onClick={() => setIntento((n) => n + 1)}>
                        Reintentar
                    </button>
                </section>
            </>
        )
    }

    // ESTADO 3: datos
    return (
        <>
            {presentacion}

            {/* RESUMEN */}
            <section id="usuarios-resumen" aria-label="Resumen de usuarios">
                {resumen.map((tarjeta) => (
                    <article key={tarjeta.titulo} className="panel producto-resumen tarjeta-resumen">
                        <span className="resumen-icono" aria-hidden="true">
                            {tarjeta.icono}
                        </span>
                        <div>
                            <h3>{tarjeta.titulo}</h3>
                            <p>{tarjeta.valor}</p>
                        </div>
                    </article>
                ))}
            </section>

            {mensajeAccion.texto && (
                <p
                    className={mensajeAccion.tipo === 'error' ? 'mensaje-error' : 'mensaje-exito'}
                    role={mensajeAccion.tipo === 'error' ? 'alert' : 'status'}
                >
                    {mensajeAccion.texto}
                </p>
            )}

            {/* El botón va como children: TablaUsuarios lo dibuja junto al buscador y el filtro.
                El administrador no ve Eliminar en su propia fila (la API igual lo impediría con 409). */}
            <TablaUsuarios
                usuarios={usuarios}
                onEliminar={eliminar}
                runEliminando={runEliminando}
                runPropio={sesion?.run}
            >
                <Link
                    id="boton-nuevo-usuario"
                    to="/admin/usuarios/nuevo"
                    className="btn btn-principal btn-listado btn-elevable"
                >
                    + Nuevo usuario
                </Link>
            </TablaUsuarios>
        </>
    )
}

export default UsuariosAdmin