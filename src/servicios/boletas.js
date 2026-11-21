
import api from './api'

// J3-08: el backend determina precios, descuentos y stock definitivos.
export async function crearBoleta(carrito, cupon = '') {
    const lineas = carrito.map(({ codigo, cantidad }) => ({ codigo, cantidad }))
    const respuesta = await api.post('/boletas', {
        lineas,
        cupon: cupon || null
    })
    return respuesta.data
}

// J3-09: consultar órdenes con la sesión JWT configurada en api.js.
export async function listarBoletas() {
    const respuesta = await api.get('/boletas')
    return respuesta.data
}

export async function obtenerBoleta(id) {
    const respuesta = await api.get(`/boletas/${encodeURIComponent(id)}`)
    return respuesta.data
}

// J3-10: el servidor devuelve solo las compras del usuario identificado por JWT.
export async function listarMisCompras() {
    const respuesta = await api.get('/boletas/mias')
    return respuesta.data
}
