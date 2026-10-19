
const CUPON_DESCUENTO = 'felices10'
const PORCENTAJE_DESCUENTO = 0.10

export function agregarProducto(carrito, producto, cantidad = 1) {
    const cantidadNueva = Number(cantidad)

    if (!Number.isInteger(cantidadNueva) || cantidadNueva <= 0) {
        return carrito
    }

    const productoExistente = carrito.find(
        item => item.codigo === producto.codigo
    )

    if (productoExistente) {
        return carrito.map(item =>
            item.codigo === producto.codigo
                ? {
                    ...item,
                    cantidad: item.cantidad + cantidadNueva
                }
                : item
        )
    }

    return [
        ...carrito,
        {
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            descripcion: producto.descripcion,
            cantidad: cantidadNueva
        }
    ]
}

export function cambiarCantidad(carrito, codigo, cantidad) {
    const cantidadNueva = Number(cantidad)

    if (!Number.isInteger(cantidadNueva)) {
        return carrito
    }

    if (cantidadNueva <= 0) {
        return eliminarProducto(carrito, codigo)
    }

    return carrito.map(item =>
        item.codigo === codigo
            ? { ...item, cantidad: cantidadNueva }
            : item
    )
}

export function aumentarCantidad(carrito, codigo) {
    return carrito.map(item =>
        item.codigo === codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
    )
}

export function disminuirCantidad(carrito, codigo) {
    return carrito
        .map(item =>
            item.codigo === codigo
                ? { ...item, cantidad: item.cantidad - 1 }
                : item
        )
        .filter(item => item.cantidad > 0)
}

export function eliminarProducto(carrito, codigo) {
    return carrito.filter(item => item.codigo !== codigo)
}

export function calcularSubtotal(carrito) {
    return carrito.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    )
}

export function validarCupon(cupon) {
    return typeof cupon === 'string' &&
        cupon.trim().toLowerCase() === CUPON_DESCUENTO
}

export function calcularDescuento(carrito, cupon = '') {
    if (!validarCupon(cupon)) {
        return 0
    }

    return Math.round(
        calcularSubtotal(carrito) * PORCENTAJE_DESCUENTO
    )
}

export function calcularTotal(carrito, cupon = '') {
    return calcularSubtotal(carrito) -
        calcularDescuento(carrito, cupon)
}

export function contarProductos(carrito) {
    return carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    )
}

export function vaciarCarrito() {
    return []
}
