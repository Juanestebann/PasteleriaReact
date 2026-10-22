
import { describe, it, expect, beforeEach } from 'vitest'
import { leerCarrito } from '../../utils/almacenamiento'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import Catalogo from './Catalogo'

function MostrarURL() {
    const ubicacion = useLocation()
    return (
        <output data-testid="url-actual">
            {ubicacion.pathname}{ubicacion.search}
        </output>
    )
}

function renderizarCatalogo(ruta = '/productos') {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route
                    path="/productos"
                    element={
                        <>
                            <Catalogo />
                            <MostrarURL />
                        </>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('C03 - Catálogo de productos', () => {
    it('muestra los 16 productos', () => {
        renderizarCatalogo()

        const listado = screen.getByRole('region', {
            name: 'Listado de productos'
        })

        expect(
            within(listado).getAllByRole('article')
        ).toHaveLength(16)

        expect(
            screen.getByText('16 productos encontrados')
        ).toBeInTheDocument()
    })

    it('filtra productos por categoría', () => {
        renderizarCatalogo()

        fireEvent.click(
            screen.getByRole('link', {
                name: 'Sin Gluten'
            })
        )

        expect(
            screen.getByText('2 productos encontrados')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Brownie Sin Gluten')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Pan Sin Gluten')
        ).toBeInTheDocument()
    })

    it('busca productos por nombre', () => {
        renderizarCatalogo()

        fireEvent.change(
            screen.getByRole('searchbox', {
                name: 'Buscar productos'
            }),
            {
                target: {
                    value: 'Tiramisú'
                }
            }
        )

        expect(
            screen.getByText('1 producto encontrado')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Tiramisú Clásico')
        ).toBeInTheDocument()
    })

    it('lee la categoría desde la URL', () => {
        renderizarCatalogo(
            '/productos?categoria=veganos'
        )

        expect(
            screen.getByText('2 productos encontrados')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Torta Vegana de Chocolate')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Galletas Veganas de Avena')
        ).toBeInTheDocument()
    })

    it('actualiza la URL al cambiar de categoría', () => {
        renderizarCatalogo()

        fireEvent.click(
            screen.getByRole('link', {
                name: 'Tortas Cuadradas'
            })
        )

        expect(
            screen.getByTestId('url-actual')
        ).toHaveTextContent(
            '/productos?categoria=cuadradas'
        )
    })

    it('muestra mensaje cuando no hay resultados', () => {
        renderizarCatalogo(
            '/productos?buscar=producto-inexistente'
        )

        expect(
            screen.getByText('0 productos encontrados')
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'No se encontraron productos para esta búsqueda.'
            )
        ).toBeInTheDocument()
    })
})


describe('J04 - Añadir desde tarjeta del catálogo', () => {
    beforeEach(() => localStorage.clear())

    it('añade el producto al carrito directamente desde su tarjeta', () => {
        renderizarCatalogo()
        fireEvent.click(screen.getByRole('button', {
            name: 'Agregar Torta Cuadrada de Frutas al carrito'
        }))
        const carrito = leerCarrito()
        expect(carrito).toEqual(expect.arrayContaining([
            expect.objectContaining({ codigo: 'TC002', cantidad: 1 })
        ]))
        expect(screen.getByText('Torta Cuadrada de Frutas añadido al carrito.')).toBeInTheDocument()
    })

    it('incrementa cantidad del mismo producto sin duplicar filas', () => {
        renderizarCatalogo()
        const boton = screen.getByRole('button', {
            name: 'Agregar Torta Cuadrada de Frutas al carrito'
        })
        fireEvent.click(boton)
        fireEvent.click(boton)
        const carrito = leerCarrito()
        expect(carrito.filter(item => item.codigo === 'TC002')).toHaveLength(1)
        expect(carrito.find(item => item.codigo === 'TC002').cantidad).toBe(2)
    })
})
