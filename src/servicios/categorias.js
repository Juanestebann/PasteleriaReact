
import api from './api'

export async function obtenerCategorias() {
    const respuesta = await api.get('/categorias')
    return respuesta.data
}
