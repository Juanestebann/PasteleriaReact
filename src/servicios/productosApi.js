
import api from './api'

export async function obtenerProductos() {
    const respuesta = await api.get('/productos')
    return respuesta.data
}
