
import { describe, it, expect, beforeEach } from 'vitest'
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
    beforeEach(() => localStorage.clear())
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

    it('permite añadir productos al carrito', () => {
        renderizarDetalle()

        const boton = screen.getByRole('button', {
            name: 'Añadir al carrito'
        })

        expect(boton).toBeEnabled()

        fireEvent.click(boton)

        const carrito = JSON.parse(localStorage.getItem('carrito'))

        expect(carrito).toHaveLength(1)
        expect(carrito[0].codigo).toBe('TC001')
        expect(carrito[0].cantidad).toBe(1)
    })

    it('permite añadir la cantidad seleccionada', () => {
        renderizarDetalle()

        const selector = screen.getByRole('combobox', {
            name: 'Cantidad'
        })

        fireEvent.change(selector, {
            target: { value: '3' }
        })

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Añadir al carrito'
            })
        )

        const carrito = JSON.parse(localStorage.getItem('carrito'))

        expect(carrito[0].cantidad).toBe(3)
    })
})

describe('J06 - Inventario compartido en detalle', () => {
    it('muestra precio actualizado desde almacenamiento', () => {
        localStorage.setItem('productos', JSON.stringify([{
            codigo: 'TC001', nombre: 'Torta actualizada', precio: 33000,
            imagen: '/img/test.png', categoria: 'cuadradas', stock: 2,
            stockCritico: 1, descripcion: 'Nueva descripción'
        }]))
        try {
            renderizarDetalle('TC001')
            expect(screen.getByRole('heading', { name: 'Torta actualizada' })).toBeInTheDocument()
            expect(screen.getByText('$33.000 CLP')).toBeInTheDocument()
        } finally {
            localStorage.removeItem('productos')
        }
    })
})
