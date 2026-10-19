
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import DetalleProducto from './DetalleProducto'

function renderizarDetalle(codigo = 'TC001') {
    return render(
        <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
            <Routes>
                <Route
                    path="/producto/:codigo"
                    element={<DetalleProducto />}
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('C04 - Detalle de producto', () => {
    it('muestra los datos del producto seleccionado', () => {
        renderizarDetalle()

        expect(
            screen.getByRole('heading', {
                name: 'Torta Cuadrada de Chocolate'
            })
        ).toBeInTheDocument()

        expect(
            screen.getByText('$45.000 CLP')
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

    it('permite seleccionar cantidades válidas', () => {
        renderizarDetalle()

        const selector = screen.getByRole('combobox', {
            name: 'Cantidad'
        })

        expect(within(selector).getAllByRole('option')).toHaveLength(10)

        fireEvent.change(selector, {
            target: { value: '4' }
        })

        expect(selector).toHaveValue('4')
    })

    it('respeta el stock disponible', () => {
        renderizarDetalle('TC002')

        const selector = screen.getByRole('combobox', {
            name: 'Cantidad'
        })

        expect(within(selector).getAllByRole('option')).toHaveLength(2)
    })

    it('muestra cuatro productos relacionados', () => {
        renderizarDetalle()

        const relacionados = screen.getByRole('region', {
            name: 'Productos relacionados'
        })

        expect(
            within(relacionados).getAllByRole('link')
        ).toHaveLength(4)

        expect(
            within(relacionados).queryByRole('link', {
                name: 'Ver Torta Cuadrada de Chocolate'
            })
        ).not.toBeInTheDocument()
    })

    it('muestra un mensaje para un código inexistente', () => {
        renderizarDetalle('NOEXISTE')

        expect(
            screen.getByRole('heading', {
                name: 'Producto no encontrado'
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', {
                name: 'Volver al catálogo'
            })
        ).toHaveAttribute('href', '/productos')
    })

    it('mantiene deshabilitado el carrito temporalmente', () => {
        renderizarDetalle()

        expect(
            screen.getByRole('button', {
                name: 'Añadir al carrito'
            })
        ).toBeDisabled()
    })
})
