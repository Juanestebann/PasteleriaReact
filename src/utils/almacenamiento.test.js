
import { describe, it, expect, beforeEach } from 'vitest'
import {
    CLAVE_CARRITO,
    leerAlmacenamiento,
    guardarAlmacenamiento,
    eliminarAlmacenamiento,
    leerCarrito,
    guardarCarrito
} from './almacenamiento'

describe('C05 - Almacenamiento del carrito', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('utiliza la clave original carrito', () => {
        expect(CLAVE_CARRITO).toBe('carrito')
    })

    it('guarda información en localStorage', () => {
        const resultado = guardarAlmacenamiento(
            'prueba',
            { nombre: 'Chocolate' }
        )

        expect(resultado).toBe(true)
        expect(
            JSON.parse(localStorage.getItem('prueba'))
        ).toEqual({ nombre: 'Chocolate' })
    })

    it('recupera información almacenada', () => {
        localStorage.setItem(
            'prueba',
            JSON.stringify({ precio: 45000 })
        )

        expect(leerAlmacenamiento('prueba')).toEqual({
            precio: 45000
        })
    })

    it('devuelve el valor por defecto si no hay datos', () => {
        expect(leerAlmacenamiento('inexistente', [])).toEqual([])
    })

    it('evita errores con JSON corrupto', () => {
        localStorage.setItem('carrito', '{datos-invalidos')

        expect(leerCarrito()).toEqual([])
    })

    it('devuelve un arreglo vacío si el carrito no es un arreglo', () => {
        localStorage.setItem(
            'carrito',
            JSON.stringify({ codigo: 'TC001' })
        )

        expect(leerCarrito()).toEqual([])
    })

    it('guarda y recupera un carrito', () => {
        const carrito = [
            {
                codigo: 'TC001',
                nombre: 'Torta Cuadrada de Chocolate',
                precio: 45000,
                cantidad: 2
            }
        ]

        expect(guardarCarrito(carrito)).toBe(true)
        expect(leerCarrito()).toEqual(carrito)
    })

    it('rechaza un carrito que no es un arreglo', () => {
        expect(guardarCarrito('datos incorrectos')).toBe(false)
    })

    it('elimina información almacenada', () => {
        guardarAlmacenamiento('prueba', 123)

        expect(eliminarAlmacenamiento('prueba')).toBe(true)
        expect(localStorage.getItem('prueba')).toBeNull()
    })
})
