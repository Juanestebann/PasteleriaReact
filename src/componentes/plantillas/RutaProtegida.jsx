import { Navigate, Outlet, useLocation } from 'react-router'

// J3-06: comprueba el perfil confirmado por /auth/me desde App.
function RutaProtegida({ sesion, perfilesPermitidos = [] }) {
    const ubicacion = useLocation()

    // Sin iniciar sesión: conserva la ruta para volver después del login.
    if (!sesion) {
        return <Navigate to="/login" state={{ from: ubicacion }} replace />
    }

    // Autenticado pero sin permiso: la página 403 no cierra la sesión.
    if (!perfilesPermitidos.includes(sesion.tipoUsuario)) {
        return <Navigate to="/403" state={{ from: ubicacion }} replace />
    }

    return <Outlet />
}

export default RutaProtegida
