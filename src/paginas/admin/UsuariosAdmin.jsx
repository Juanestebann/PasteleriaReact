// Página del administrador: gestión de usuarios (/admin/usuarios).
// Solo el Administrador puede entrar (lo controla RutaProtegida en App.jsx).
import { Link } from 'react-router'
import TablaUsuarios from '../../componentes/organismos/TablaUsuarios'

function UsuariosAdmin({ usuarios = [] }) {
    // Contadores para las tarjetas de resumen (mismo patrón que "Total productos" de la Ev1)
    const contar = (rol) => usuarios.filter((usuario) => usuario.tipoUsuario === rol).length
    const resumen = [
        { titulo: 'Total usuarios', valor: usuarios.length, icono: '👥' },
        { titulo: 'Clientes', valor: contar('Cliente'), icono: '🧁' },
        { titulo: 'Vendedores', valor: contar('Vendedor'), icono: '🛍️' },
        { titulo: 'Administradores', valor: contar('Administrador'), icono: '🛡️' },
    ]

    return (
        <>
            <section id="usuarios-presentacion" className="panel panel-presentacion">
                <h2>Gestión de usuarios</h2>
                <p>Como Administrador puedes ver, crear y editar los usuarios registrados en el sistema.</p>
            </section>

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

            {/* El botón va como children: TablaUsuarios lo dibuja junto al buscador y el filtro */}
            <TablaUsuarios usuarios={usuarios}>
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