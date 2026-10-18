// Este componente será la estructura compartida por 
// las páginas administrativas. Más adelante 
// incorporaremos el menú lateral y el diseño 
// definitivo.
import { Outlet } from 'react-router'

function LayoutAdmin() {
    return (
        <div>
            <header>
                <h1>Administración — Pastelería Mil Sabores</h1>
            </header>

            <Outlet />
        </div>
    )
}

export default LayoutAdmin
