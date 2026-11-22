
import api from './api'

export async function obtenerProductos(categoria = '') {
    const respuesta = await api.get('/productos', {
        params: categoria ? { categoria } : {}
    })

    return respuesta.data
}

export async function obtenerProductoPorCodigo(codigo) {
    const respuesta = await api.get(`/productos/codigo/${encodeURIComponent(codigo)}`)
    return respuesta.data
}
