import { Outlet } from 'react-router'
import Encabezado from '../organismos/Encabezado'
import PiePagina from '../organismos/PiePagina'

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
            <PiePagina />
        </>
    )
}

export default LayoutTienda