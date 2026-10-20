
import { describe, it, expect } from 'vitest'
import {
    agregarProducto,
    cambiarCantidad,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    calcularSubtotal,
    validarCupon,
    calcularDescuento,
    calcularTotal,
    contarProductos,
    vaciarCarrito
} from './carrito'

const productoPrueba = {
    codigo: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    imagen: '/img/Torta Cuadrada de Chocolate.png',
    descripcion: 'Torta de chocolate',
    stock: 10
}

describe('C05 - Utilidades del carrito', () => {
    it('agrega un producto al carrito', () => {
        const carrito = agregarProducto([], productoPrueba)

        expect(carrito).toHaveLength(1)
        expect(carrito[0].codigo).toBe('TC001')
        expect(carrito[0].cantidad).toBe(1)
    })

    it('suma cantidades de un producto existente', () => {
        const inicial = agregarProducto([], productoPrueba)
        const resultado = agregarProducto(inicial, productoPrueba, 2)

        expect(resultado).toHaveLength(1)
        expect(resultado[0].cantidad).toBe(3)
    })

    it('rechaza cantidades inválidas al agregar', () => {
        expect(agregarProducto([], productoPrueba, 0)).toEqual([])
        expect(agregarProducto([], productoPrueba, -1)).toEqual([])
        expect(agregarProducto([], productoPrueba, 1.5)).toEqual([])
    })

    it('modifica la cantidad de un producto', () => {
        const carrito = agregarProducto([], productoPrueba)
        const resultado = cambiarCantidad(carrito, 'TC001', 4)

        expect(resultado[0].cantidad).toBe(4)
    })

    it('aumenta la cantidad de un producto', () => {
        const carrito = agregarProducto([], productoPrueba)
        const resultado = aumentarCantidad(carrito, 'TC001')

        expect(resultado[0].cantidad).toBe(2)
    })

    it('disminuye la cantidad de un producto', () => {
        const carrito = agregarProducto([], productoPrueba, 3)
        const resultado = disminuirCantidad(carrito, 'TC001')

        expect(resultado[0].cantidad).toBe(2)
    })

    it('elimina el producto cuando la cantidad llega a cero', () => {
        const carrito = agregarProducto([], productoPrueba)
        const resultado = disminuirCantidad(carrito, 'TC001')

        expect(resultado).toEqual([])
    })

    it('elimina un producto por código', () => {
        const carrito = agregarProducto([], productoPrueba)
        const resultado = eliminarProducto(carrito, 'TC001')

        expect(resultado).toEqual([])
    })

    it('calcula correctamente el subtotal', () => {
        const carrito = agregarProducto([], productoPrueba, 2)

        expect(calcularSubtotal(carrito)).toBe(90000)
    })

    it('valida el cupón felices10', () => {
        expect(validarCupon('felices10')).toBe(true)
        expect(validarCupon('FELICES10')).toBe(true)
        expect(validarCupon('incorrecto')).toBe(false)
    })

    it('aplica un descuento del 10 por ciento', () => {
        const carrito = agregarProducto([], productoPrueba)

        expect(calcularDescuento(carrito, 'felices10')).toBe(4500)
        expect(calcularTotal(carrito, 'felices10')).toBe(40500)
    })

    it('no aplica descuentos con cupones inválidos', () => {
        const carrito = agregarProducto([], productoPrueba)

        expect(calcularDescuento(carrito, 'otro')).toBe(0)
        expect(calcularTotal(carrito, 'otro')).toBe(45000)
    })

    it('cuenta todas las unidades del carrito', () => {
        const carrito = agregarProducto([], productoPrueba, 3)

        expect(contarProductos(carrito)).toBe(3)
    })

    it('vacía el carrito', () => {
        const carrito = agregarProducto([], productoPrueba)

        expect(vaciarCarrito()).toEqual([])
        expect(carrito).toHaveLength(1)
    })

    it('no modifica el arreglo original al agregar cantidades', () => {
        const original = agregarProducto([], productoPrueba)
        const actualizado = agregarProducto(original, productoPrueba, 2)

        expect(original[0].cantidad).toBe(1)
        expect(actualizado[0].cantidad).toBe(3)
        expect(actualizado).not.toBe(original)
    })

    // C11 - Pruebas de regresión de stock

    it('permite agregar exactamente las unidades disponibles', () => {
        const resultado = agregarProducto(
            [],
            { ...productoPrueba, stock: 2 },
            2
        )

        expect(resultado).toHaveLength(1)
        expect(resultado[0].cantidad).toBe(2)
    })

    it('no permite agregar cantidades mayores al stock disponible', () => {
        const producto = { ...productoPrueba, stock: 2 }
        const carrito = agregarProducto([], producto, 2)

        const resultado = agregarProducto(carrito, producto, 1)

        expect(resultado[0].cantidad).toBe(2)
    })

    it('no permite aumentar la cantidad por encima del stock', () => {
        const carrito = agregarProducto(
            [],
            { ...productoPrueba, stock: 2 },
            2
        )

        const resultado = aumentarCantidad(carrito, 'TC001')

        expect(resultado[0].cantidad).toBe(2)
    })
})
