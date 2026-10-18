// Explicación: Outlet indica dónde React Router debe 
// mostrar la página correspondiente a la URL. 
// Más adelante agregaremos aquí el encabezado y el 
// pie de página de la pastelería.

import { Outlet } from 'react-router'

function LayoutTienda() {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default LayoutTienda
