
import { Navigate, Outlet, useLocation } from 'react-router'

function RutaProtegida({ sesion, perfilesPermitidos }) {
    const location = useLocation()

    // Usuario sin sesión
    if (!sesion) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    // Usuario autenticado, pero sin permisos
    // S06: el perfil se guarda como tipoUsuario (contrato acordado en el informe)
    if (!perfilesPermitidos.includes(sesion.tipoUsuario)) {
        return (
            <main>
                <h1>403 - Acceso denegado</h1>
                <p>No tienes permisos para acceder a esta sección.</p>
            </main>
        )
    }

    // Usuario autorizado
    return <Outlet />
}

export default RutaProtegida