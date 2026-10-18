import { Outlet } from 'react-router'
import Encabezado from '../organismos/Encabezado'

function LayoutTienda() {
    return (
        <>
            <Encabezado
                usuario={null}
                cantidadCarrito={0}
            />

            <main>
                <Outlet />
            </main>
        </>
    )
}

export default LayoutTienda