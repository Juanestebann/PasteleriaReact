
export const CLAVE_CARRITO = 'carrito'
export const EVENTO_CARRITO_ACTUALIZADO = 'carrito-actualizado'

export function leerAlmacenamiento(clave, valorDefecto = null) {
    try {
        const datos = localStorage.getItem(clave)

        if (datos === null) {
            return valorDefecto
        }

        return JSON.parse(datos)
    } catch {
        return valorDefecto
    }
}

export function guardarAlmacenamiento(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor))
        return true
    } catch {
        return false
    }
}

export function eliminarAlmacenamiento(clave) {
    try {
        localStorage.removeItem(clave)
        return true
    } catch {
        return false
    }
}

export function leerCarrito() {
    const datos = leerAlmacenamiento(CLAVE_CARRITO, [])

    return Array.isArray(datos) ? datos : []
}

export function guardarCarrito(carrito) {
    if (!Array.isArray(carrito)) {
        return false
    }

    const guardado = guardarAlmacenamiento(CLAVE_CARRITO, carrito)
    if (guardado && typeof window !== 'undefined') {
        window.dispatchEvent(new Event(EVENTO_CARRITO_ACTUALIZADO))
    }
    return guardado
}
