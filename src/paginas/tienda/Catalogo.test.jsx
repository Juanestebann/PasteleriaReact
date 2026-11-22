
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { productosIniciales } from '../../datos/productos'
import { leerCarrito } from '../../utils/almacenamiento'
import Catalogo from './Catalogo'

const { obtenerCategoriasMock, obtenerProductosMock } = vi.hoisted(() => ({
    obtenerCategoriasMock: vi.fn(),
    obtenerProductosMock: vi.fn()
}))

vi.mock('../../servicios/categorias', () => ({
    obtenerCategorias: obtenerCategoriasMock
}))

vi.mock('../../servicios/productosApi', () => ({
    obtenerProductos: obtenerProductosMock
}))

const categoriasSimuladas = [
    { id: 1, slug: 'cuadradas', nombre: 'Tortas Cuadradas' },
    { id: 2, slug: 'circulares', nombre: 'Tortas Circulares' },
    { id: 3, slug: 'individuales', nombre: 'Postres Individuales' },
    { id: 4, slug: 'sin-azucar', nombre: 'Sin Azúcar' },
    { id: 5, slug: 'tradicional', nombre: 'Tradicional' },
    { id: 6, slug: 'sin-gluten', nombre: 'Sin Gluten' },
    { id: 7, slug: 'veganos', nombre: 'Veganos' },
    { id: 8, slug: 'especiales', nombre: 'Tortas Especiales' }
]

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

beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    obtenerCategoriasMock.mockResolvedValue(categoriasSimuladas)

    obtenerProductosMock.mockImplementation(async (categoria = '') =>
        categoria
            ? productosIniciales.filter(
                producto => producto.categoria === categoria
            )
            : [...productosIniciales]
    )
})

describe('C3-06 - Catálogo conectado a la API', () => {
    it('muestra los 16 productos obtenidos de la API', async () => {
        renderizarCatalogo()

        const listado = await screen.findByRole('region', {
            name: 'Listado de productos'
        })

        expect(
            within(listado).getAllByRole('article')
        ).toHaveLength(16)

        expect(
            screen.getByText('16 productos encontrados')
        ).toBeInTheDocument()

        expect(obtenerProductosMock).toHaveBeenCalledWith('')
    })

    it('filtra productos por categoría consultando la API', async () => {
        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

        fireEvent.click(
            screen.getByRole('link', {
                name: 'Sin Gluten'
            })
        )

        await waitFor(() => {
            expect(obtenerProductosMock).toHaveBeenCalledWith('sin-gluten')

            expect(
                screen.getByText('2 productos encontrados')
            ).toBeInTheDocument()
        })

        expect(
            screen.getByText('Brownie Sin Gluten')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Pan Sin Gluten')
        ).toBeInTheDocument()
    })

    it('busca productos por nombre', async () => {
        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

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

    it('lee la categoría desde la URL y la envía a la API', async () => {
        renderizarCatalogo('/productos?categoria=veganos')

        await screen.findByText('2 productos encontrados')

        expect(
            obtenerProductosMock
        ).toHaveBeenCalledWith('veganos')

        expect(
            screen.getByText('Torta Vegana de Chocolate')
        ).toBeInTheDocument()

        expect(
            screen.getByText('Galletas Veganas de Avena')
        ).toBeInTheDocument()
    })

    it('actualiza la URL al cambiar de categoría', async () => {
        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

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

        await waitFor(() => {
            expect(
                obtenerProductosMock
            ).toHaveBeenCalledWith('cuadradas')
        })
    })

    it('muestra un mensaje cuando no hay resultados de búsqueda', async () => {
        renderizarCatalogo(
            '/productos?buscar=producto-inexistente'
        )

        await screen.findByText('0 productos encontrados')

        expect(
            screen.getByText(
                'No se encontraron productos para esta búsqueda.'
            )
        ).toBeInTheDocument()
    })

    it('carga las categorías desde la API', async () => {
        renderizarCatalogo()

        await waitFor(() => {
            expect(obtenerCategoriasMock).toHaveBeenCalledTimes(1)
        })

        await screen.findByText('16 productos encontrados')

        expect(
            screen.getByRole('link', {
                name: 'Sin Gluten'
            })
        ).toBeInTheDocument()
    })
})

describe('J04 - Añadir desde tarjeta del catálogo', () => {
    it('añade el producto al carrito directamente desde su tarjeta', async () => {
        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Agregar Torta Cuadrada de Frutas al carrito'
            })
        )

        expect(leerCarrito()).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    codigo: 'TC002',
                    cantidad: 1
                })
            ])
        )

        expect(
            screen.getByText(
                'Torta Cuadrada de Frutas añadido al carrito.'
            )
        ).toBeInTheDocument()
    })

    it('incrementa cantidad del mismo producto sin duplicar filas', async () => {
        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

        const boton = screen.getByRole('button', {
            name: 'Agregar Torta Cuadrada de Frutas al carrito'
        })

        fireEvent.click(boton)
        fireEvent.click(boton)

        const carrito = leerCarrito()

        expect(
            carrito.filter(item => item.codigo === 'TC002')
        ).toHaveLength(1)

        expect(
            carrito.find(item => item.codigo === 'TC002').cantidad
        ).toBe(2)
    })
})

describe('C3-06 - Estados de consulta y fuente de datos', () => {
    it('utiliza los productos de la API y no el inventario de localStorage', async () => {
        localStorage.setItem('productos', JSON.stringify([{
            codigo: 'NEW001',
            nombre: 'Pastel nuevo',
            precio: 12000,
            imagen: '/img/test.png',
            categoria: 'especiales',
            stock: 3,
            stockCritico: 1,
            descripcion: 'Prueba'
        }]))

        renderizarCatalogo()

        await screen.findByText('16 productos encontrados')

        expect(
            screen.queryByText('Pastel nuevo')
        ).not.toBeInTheDocument()

        expect(
            obtenerProductosMock
        ).toHaveBeenCalledWith('')
    })

    it('muestra Cargando mientras espera la respuesta de productos', async () => {
        obtenerProductosMock.mockImplementationOnce(
            () => new Promise(() => {})
        )

        await act(async () => {
            renderizarCatalogo()
        })

        expect(
            screen.getByText('Cargando productos...')
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('region', {
                name: 'Listado de productos'
            })
        ).not.toBeInTheDocument()

        expect(
            obtenerProductosMock
        ).toHaveBeenCalledWith('')

        expect(
            obtenerCategoriasMock
        ).toHaveBeenCalledTimes(1)
    })

    it('muestra el error y el botón Reintentar si falla la API', async () => {
        obtenerProductosMock.mockRejectedValueOnce(
            new Error('Sin conexión')
        )

        const consola = vi.spyOn(console, 'error')
            .mockImplementation(() => {})

        try {
            renderizarCatalogo()

            expect(
                await screen.findByRole('alert')
            ).toHaveTextContent(
                'No hay conexión con el servidor.'
            )

            expect(
                screen.getByRole('button', {
                    name: 'Reintentar'
                })
            ).toBeInTheDocument()
        } finally {
            consola.mockRestore()
        }
    })

    it('vuelve a consultar la API al pulsar Reintentar', async () => {
        obtenerProductosMock.mockRejectedValueOnce(
            new Error('Sin conexión')
        )

        const consola = vi.spyOn(console, 'error')
            .mockImplementation(() => {})

        try {
            renderizarCatalogo()

            await screen.findByRole('alert')

            fireEvent.click(
                screen.getByRole('button', {
                    name: 'Reintentar'
                })
            )

            await screen.findByText('16 productos encontrados')

            expect(
                obtenerProductosMock
            ).toHaveBeenCalledTimes(2)

            expect(
                screen.queryByRole('alert')
            ).not.toBeInTheDocument()
        } finally {
            consola.mockRestore()
        }
    })
})
