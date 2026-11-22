
import api from './api'

// C3-06: listar productos y filtrar por categoria.
export async function obtenerProductos(categoria = '') {
    const respuesta = await api.get('/productos', {
        params: categoria ? { categoria } : {}
    })
    return respuesta.data
}

// C3-06: buscar un producto por su codigo.
export async function obtenerProductoPorCodigo(codigo) {
    const respuesta = await api.get(
        `/productos/codigo/${encodeURIComponent(codigo)}`
    )
    return respuesta.data
}

// C3-07: consultar productos con stock critico.
export async function obtenerProductosStockCritico() {
    const respuesta = await api.get('/productos/stock-critico')
    return respuesta.data
}

// C3-07: crear un producto.
export async function crearProductoApi(producto) {
    const respuesta = await api.post('/productos', producto)
    return respuesta.data
}

// C3-07: actualizar un producto por su ID.
export async function actualizarProductoApi(id, producto) {
    const respuesta = await api.put(
        `/productos/${encodeURIComponent(id)}`,
        producto
    )
    return respuesta.data
}

// C3-07: eliminar un producto por su ID.
export async function eliminarProductoApi(id) {
    await api.delete(`/productos/${encodeURIComponent(id)}`)
}
