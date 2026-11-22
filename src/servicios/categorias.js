
import api from './api'

// C3-06: obtener las categorías disponibles.
export async function obtenerCategorias() {
    const respuesta = await api.get('/categorias')
    return respuesta.data
}

// C3-09: obtener una categoría por su ID.
export async function obtenerCategoriaPorId(id) {
    const respuesta = await api.get(
        `/categorias/${encodeURIComponent(id)}`
    )
    return respuesta.data
}

// C3-09: crear una categoría.
// El backend recibe { slug, nombre }.
export async function crearCategoriaApi(categoria) {
    const respuesta = await api.post(
        '/categorias',
        categoria
    )
    return respuesta.data
}

// C3-09: actualizar una categoría por su ID.
export async function actualizarCategoriaApi(id, categoria) {
    const respuesta = await api.put(
        `/categorias/${encodeURIComponent(id)}`,
        categoria
    )
    return respuesta.data
}

// C3-09: eliminar una categoría por su ID.
export async function eliminarCategoriaApi(id) {
    await api.delete(
        `/categorias/${encodeURIComponent(id)}`
    )
}
