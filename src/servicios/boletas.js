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
