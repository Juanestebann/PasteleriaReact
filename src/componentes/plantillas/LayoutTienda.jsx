import { Outlet } from 'react-router'
import Encabezado from '../organismos/Encabezado'
import PiePagina from '../organismos/PiePagina'

function LayoutTienda({ usuario = null, cantidadCarrito = 0, onCerrarSesion }) {
    return (
        <>
            {/* S06: la sesión y el carrito llegan por props desde App.jsx */}
            <Encabezado
                usuario={usuario}
                cantidadCarrito={cantidadCarrito}
                onCerrarSesion={onCerrarSesion}
            />

            <main>
                <Outlet />
            </main>
            <PiePagina />
        </>
    )
}

export default LayoutTienda