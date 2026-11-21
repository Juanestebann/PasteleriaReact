
const CLAVE_SESION = 'sesion'

export function leerSesion() {
    try {
        const datos = localStorage.getItem(CLAVE_SESION)
        return datos ? JSON.parse(datos) : null
    } catch {
        return null
    }
}

export function guardarSesion(sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({
        accessToken: sesion.accessToken,
        refreshToken: sesion.refreshToken,
        usuario: sesion.usuario
    }))
}

export function borrarSesion() {
    localStorage.removeItem(CLAVE_SESION)
}
