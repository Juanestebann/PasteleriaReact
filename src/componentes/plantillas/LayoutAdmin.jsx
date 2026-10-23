
import { Outlet } from 'react-router'
import MenuAdmin from '../organismos/MenuAdmin'

function LayoutAdmin({ sesion, onCerrarSesion }) {
    return (
        <div id="admin-aplicacion">
            <MenuAdmin sesion={sesion} />

            <div id="contenido-admin">
                <header id="cabecera-admin">
                    <div>
                        <h2>Administración — Pastelería Mil Sabores</h2>
                        <p>
                            Bienvenido al panel de administración
                        </p>
                    </div>

                    <div id="sesion-admin">
                        <span id="nombre-usuario-admin">
                            {sesion?.nombre ?? 'Usuario'}
                        </span>

                        <button
                            id="cerrar-sesion-admin"
                            type="button"
                            onClick={onCerrarSesion}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </header>

                <main id="principal-admin">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default LayoutAdmin
