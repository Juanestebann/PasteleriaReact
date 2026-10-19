
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import TarjetaProducto from './TarjetaProducto'

const productoPrueba = {
    codigo: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    precio: 45000,
    imagen: '/img/Torta Cuadrada de Chocolate.png',
    stock: 10
}

describe('C02 - TarjetaProducto', () => {
    it('muestra nombre, precio e imagen', () => {
        render(
            <MemoryRouter>
                <TarjetaProducto producto={productoPrueba} />
            </MemoryRouter>
        )

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument()

        expect(
            screen.getByText(/\$45\.000/)
        ).toBeInTheDocument()

        expect(
            screen.getByRole('img', {
                name: 'Torta Cuadrada de Chocolate'
            })
        ).toHaveAttribute(
            'src',
            '/img/Torta Cuadrada de Chocolate.png'
        )
    })

    it('dirige al detalle del producto', () => {
        render(
            <MemoryRouter>
                <TarjetaProducto producto={productoPrueba} />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('link', { name: 'Ver producto' })
        ).toHaveAttribute('href', '/producto/TC001')
    })

    it('ejecuta onAgregar al hacer clic', () => {
        const onAgregar = vi.fn()

        render(
            <MemoryRouter>
                <TarjetaProducto
                    producto={productoPrueba}
                    onAgregar={onAgregar}
                />
            </MemoryRouter>
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Agregar Torta Cuadrada de Chocolate al carrito'
            })
        )

        expect(onAgregar).toHaveBeenCalledWith(productoPrueba)
        expect(onAgregar).toHaveBeenCalledTimes(1)
    })

    it('impide agregar un producto sin stock', () => {
        const onAgregar = vi.fn()

        render(
            <MemoryRouter>
                <TarjetaProducto
                    producto={{ ...productoPrueba, stock: 0 }}
                    onAgregar={onAgregar}
                />
            </MemoryRouter>
        )

        const boton = screen.getByRole('button', {
            name: 'Agregar Torta Cuadrada de Chocolate al carrito'
        })

        expect(boton).toBeDisabled()
        expect(onAgregar).not.toHaveBeenCalled()
    })
})
