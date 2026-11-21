// J3-04 / J3-05: almacenamiento único de la autenticación JWT.
export const CLAVE_SESION_JWT = 'sesion'

export function leerSesion() {
    try {
        const datos = localStorage.getItem(CLAVE_SESION_JWT)
        return datos ? JSON.parse(datos) : null
    } catch {
        return null
    }
}

export function guardarSesion(sesion) {
    localStorage.setItem(CLAVE_SESION_JWT, JSON.stringify({
        accessToken: sesion.accessToken,
        refreshToken: sesion.refreshToken,
        usuario: sesion.usuario,
    }))
}

export function borrarSesion() {
    localStorage.removeItem(CLAVE_SESION_JWT)
}

// Comprueba la fecha de vencimiento del JWT.
// La validación definitiva corresponde al backend.
export function tokenVencido(token) {
    if (typeof token !== 'string') return true

    try {
        const partes = token.split('.')
        if (partes.length !== 3) return true

        const base64 = partes[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')

        const payload = JSON.parse(atob(base64))

        return typeof payload.exp !== 'number' ||
            payload.exp * 1000 <= Date.now()
    } catch {
        return true
    }
}