
import { beforeEach, describe, expect, it } from 'vitest'
import { productosIniciales } from '../datos/productos'
import {
    CLAVE_PRODUCTOS,
    leerProductos,
    guardarProductos,
    crearProducto,
    actualizarProducto,
    buscarProductoPorCodigo,
} from './productos'

const productoNuevo = {
    codigo: 'TC099',
    nombre: 'Torta de prueba',
    precio: 15000,
    imagen: '/img/torta-prueba.png',
    descripcion: 'Producto utilizado para pruebas.',
    categoria: 'cuadradas',
    stock: 10,
    stockCritico: 3,
}

describe('C10 - Gestión y persistencia de productos', () => {
    beforeEach(() => {
        localStorage.removeItem(CLAVE_PRODUCTOS)
    })

    it('carga los 16 productos iniciales si no hay datos guardados', () => {
        const productos = leerProductos()

        expect(productos).toHaveLength(16)
        expect(productos).toEqual(productosIniciales)
    })

    it('lee los productos previamente guardados', () => {
        localStorage.setItem(
            CLAVE_PRODUCTOS,
            JSON.stringify([productoNuevo])
        )

        expect(leerProductos()).toEqual([productoNuevo])
    })

    it('recupera los productos iniciales cuando el almacenamiento está corrupto', () => {
        localStorage.setItem(CLAVE_PRODUCTOS, '{datos-invalidos')

        expect(leerProductos()).toEqual(productosIniciales)
    })

    it('guarda correctamente el inventario', () => {
        const guardado = guardarProductos([productoNuevo])

        expect(guardado).toBe(true)
        expect(leerProductos()).toEqual([productoNuevo])
    })

    it('rechaza guardar datos que no sean un arreglo', () => {
        expect(guardarProductos(null)).toBe(false)
        expect(guardarProductos({})).toBe(false)
    })

    it('agrega un producto nuevo al inventario', () => {
        const productos = crearProducto(
            productosIniciales,
            productoNuevo
        )

        expect(productos).toHaveLength(17)
        expect(productos).toContainEqual(productoNuevo)
    })

    it('no permite crear un producto con código duplicado', () => {
        const productos = crearProducto(
            productosIniciales,
            {
                ...productoNuevo,
                codigo: 'TC001',
            }
        )

        expect(productos).toHaveLength(16)
        expect(productos).toEqual(productosIniciales)
    })

    it('actualiza los datos de un producto existente', () => {
        const editado = {
            ...productosIniciales[0],
            precio: 48000,
            stock: 20,
        }

        const productos = actualizarProducto(
            productosIniciales,
            editado
        )

        expect(productos).toHaveLength(16)
        expect(productos[0].precio).toBe(48000)
        expect(productos[0].stock).toBe(20)
        expect(productosIniciales[0].precio).toBe(45000)
    })

    it('no modifica otros productos durante la edición', () => {
        const editado = {
            ...productosIniciales[0],
            nombre: 'Torta modificada',
        }

        const productos = actualizarProducto(
            productosIniciales,
            editado
        )

        expect(productos[1]).toEqual(productosIniciales[1])
    })

    it('encuentra un producto por su código', () => {
        const producto = buscarProductoPorCodigo(
            productosIniciales,
            'TC001'
        )

        expect(producto?.nombre).toBe(
            'Torta Cuadrada de Chocolate'
        )
    })

    it('devuelve null cuando el código no existe', () => {
        const producto = buscarProductoPorCodigo(
            productosIniciales,
            'NOEXISTE'
        )

        expect(producto).toBeNull()
    })

    it('mantiene los cambios después de guardar y volver a leer', () => {
        const productosActualizados = crearProducto(
            productosIniciales,
            productoNuevo
        )

        guardarProductos(productosActualizados)

        expect(leerProductos()).toHaveLength(17)
        expect(leerProductos()).toContainEqual(productoNuevo)
    })
})
