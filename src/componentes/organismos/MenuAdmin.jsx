
import { NavLink } from 'react-router'

function MenuAdmin({ sesion }) {
    const esAdministrador = sesion?.tipoUsuario === 'Administrador'

    return (
        <aside id="menu-admin">
            <div id="marca-admin">
                <h1>
                    Pastelería
                    <span>Mil Sabores</span>
                </h1>
                <p>Panel de administración</p>
            </div>

            <nav id="navegacion-admin" aria-label="Menú administrativo">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? 'opcion-activa' : ''
                    }
                >
                    Inicio
                </NavLink>

                <NavLink
                    to="/admin/productos"
                    className={({ isActive }) =>
                        isActive ? 'opcion-activa' : ''
                    }
                >
                    Productos
                </NavLink>

                {esAdministrador && (
                    <NavLink
                        to="/admin/usuarios"
                        className={({ isActive }) =>
                            isActive ? 'opcion-activa' : ''
                        }
                    >
                        Usuarios
                    </NavLink>
                )}

                <NavLink to="/">
                    Volver a la tienda
                </NavLink>
            </nav>
        </aside>
    )
}

export default MenuAdmin
