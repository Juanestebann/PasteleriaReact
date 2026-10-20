
import { productosIniciales } from '../datos/productos'
import {
    leerAlmacenamiento,
    guardarAlmacenamiento,
} from './almacenamiento'

export const CLAVE_PRODUCTOS = 'productos'

export function leerProductos() {
    const guardados = leerAlmacenamiento(CLAVE_PRODUCTOS, null)

    if (!Array.isArray(guardados)) {
        return [...productosIniciales]
    }

    return guardados
}

export function guardarProductos(productos) {
    if (!Array.isArray(productos)) {
        return false
    }

    return guardarAlmacenamiento(CLAVE_PRODUCTOS, productos)
}

export function crearProducto(productos, nuevoProducto) {
    const existe = productos.some(
        (producto) => producto.codigo === nuevoProducto.codigo
    )

    if (existe) {
        return productos
    }

    return [...productos, nuevoProducto]
}

export function actualizarProducto(productos, productoEditado) {
    return productos.map((producto) =>
        producto.codigo === productoEditado.codigo
            ? productoEditado
            : producto
    )
}

export function buscarProductoPorCodigo(productos, codigo) {
    return productos.find(
        (producto) => producto.codigo === codigo
    ) ?? null
}
