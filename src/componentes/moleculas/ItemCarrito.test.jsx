
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ItemCarrito from './ItemCarrito'

const productoPrueba = {
    codigo: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    descripcion: 'Torta de chocolate con ganache',
    precio: 45000,
    imagen: '/img/Torta Cuadrada de Chocolate.png',
    cantidad: 2,
    stock: 10
}

describe('C06 - ItemCarrito', () => {
    it('muestra los datos del producto', () => {
        render(<ItemCarrito producto={productoPrueba} />)

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument()

        expect(
            screen.getByText('$90.000')
        ).toBeInTheDocument()

        expect(
            screen.getByText('2')
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

    it('ejecuta el callback para aumentar', () => {
        const onAumentar = vi.fn()

        render(
            <ItemCarrito
                producto={productoPrueba}
                onAumentar={onAumentar}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Aumentar cantidad/
            })
        )

        expect(onAumentar).toHaveBeenCalledWith('TC001')
        expect(onAumentar).toHaveBeenCalledTimes(1)
    })

    it('ejecuta el callback para disminuir', () => {
        const onDisminuir = vi.fn()

        render(
            <ItemCarrito
                producto={productoPrueba}
                onDisminuir={onDisminuir}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Disminuir cantidad/
            })
        )

        expect(onDisminuir).toHaveBeenCalledWith('TC001')
    })

    it('ejecuta el callback para eliminar', () => {
        const onEliminar = vi.fn()

        render(
            <ItemCarrito
                producto={productoPrueba}
                onEliminar={onEliminar}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /Eliminar.*del carrito/
            })
        )

        expect(onEliminar).toHaveBeenCalledWith('TC001')
    })

    it('impide aumentar cuando alcanza el stock', () => {
        const onAumentar = vi.fn()

        render(
            <ItemCarrito
                producto={{
                    ...productoPrueba,
                    cantidad: 10
                }}
                onAumentar={onAumentar}
            />
        )

        expect(
            screen.getByRole('button', {
                name: /Aumentar cantidad/
            })
        ).toBeDisabled()

        expect(onAumentar).not.toHaveBeenCalled()
    })
})
