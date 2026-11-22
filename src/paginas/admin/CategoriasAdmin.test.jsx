
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from 'vitest'

import {
    render,
    screen,
    fireEvent,
    waitFor
} from '@testing-library/react'

import CategoriasAdmin from './CategoriasAdmin'

import {
    obtenerCategorias,
    crearCategoriaApi,
    actualizarCategoriaApi,
    eliminarCategoriaApi
} from '../../servicios/categorias'

vi.mock('../../servicios/categorias', () => ({
    obtenerCategorias: vi.fn(),
    crearCategoriaApi: vi.fn(),
    actualizarCategoriaApi: vi.fn(),
    eliminarCategoriaApi: vi.fn()
}))

const categoriasIniciales = [
    {
        id: 1,
        nombre: 'Tortas Cuadradas',
        slug: 'cuadradas'
    },
    {
        id: 2,
        nombre: 'Tortas Circulares',
        slug: 'circulares'
    }
]

describe('C3-09 - Administración de categorías', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        obtenerCategorias.mockResolvedValue(
            categoriasIniciales.map(categoria => ({
                ...categoria
            }))
        )

        crearCategoriaApi.mockResolvedValue({})
        actualizarCategoriaApi.mockResolvedValue({})
        eliminarCategoriaApi.mockResolvedValue(undefined)

        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('carga las categorías desde Spring Boot', async () => {
        render(<CategoriasAdmin />)

        expect(
            screen.getByText('Cargando categorías...')
        ).toBeTruthy()

        expect(
            await screen.findByText('Tortas Cuadradas')
        ).toBeTruthy()

        expect(
            screen.getByText('Tortas Circulares')
        ).toBeTruthy()

        expect(obtenerCategorias).toHaveBeenCalledTimes(1)
    })

    it('muestra el total de categorías recibidas', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        const resumen = screen.getByRole('region', {
            name: 'Resumen de categorías'
        })

        expect(resumen.textContent).toContain(
            'Total de categorías'
        )

        expect(
            resumen.querySelector('p')?.textContent
        ).toBe('2')
    })

    it('genera un identificador a partir del nombre', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.change(
            screen.getByLabelText('Nombre de la categoría'),
            {
                target: {
                    value: 'Pastelería Artesanal'
                }
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Generar identificador'
            })
        )

        expect(
            screen.getByLabelText(
                'Identificador de la categoría'
            ).value
        ).toBe('pasteleria-artesanal')
    })

    it('crea una categoría mediante la API', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.change(
            screen.getByLabelText('Nombre de la categoría'),
            {
                target: {
                    value: 'Categoría de Prueba'
                }
            }
        )

        fireEvent.change(
            screen.getByLabelText('Identificador de la categoría'),
            {
                target: {
                    value: 'prueba'
                }
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Crear categoría'
            })
        )

        await waitFor(() => {
            expect(crearCategoriaApi).toHaveBeenCalledWith({
                nombre: 'Categoría de Prueba',
                slug: 'prueba'
            })
        })

        expect(
            await screen.findByText(
                'Categoría creada correctamente.'
            )
        ).toBeTruthy()

        expect(obtenerCategorias).toHaveBeenCalledTimes(2)
    })

    it('permite editar el nombre de una categoría', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Editar Tortas Cuadradas'
            })
        )

        expect(
            screen.getByLabelText(
                'Identificador de la categoría'
            ).disabled
        ).toBe(true)

        fireEvent.change(
            screen.getByLabelText('Nombre de la categoría'),
            {
                target: {
                    value: 'Tortas Cuadradas Editadas'
                }
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Guardar cambios'
            })
        )

        await waitFor(() => {
            expect(actualizarCategoriaApi).toHaveBeenCalledWith(
                1,
                {
                    nombre: 'Tortas Cuadradas Editadas',
                    slug: 'cuadradas'
                }
            )
        })

        expect(
            await screen.findByText(
                'Categoría actualizada correctamente.'
            )
        ).toBeTruthy()
    })

    it('permite cancelar la edición', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Editar Tortas Cuadradas'
            })
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Cancelar edición'
            })
        )

        expect(
            screen.getByRole('button', {
                name: 'Crear categoría'
            })
        ).toBeTruthy()

        expect(
            screen.getByLabelText(
                'Nombre de la categoría'
            ).value
        ).toBe('')

        expect(actualizarCategoriaApi).not.toHaveBeenCalled()
    })

    it('elimina una categoría después de confirmar', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Eliminar Tortas Circulares'
            })
        )

        await waitFor(() => {
            expect(eliminarCategoriaApi).toHaveBeenCalledWith(2)
        })

        expect(window.confirm).toHaveBeenCalledTimes(1)

        await waitFor(() => {
            expect(
                screen.queryByText('Tortas Circulares')
            ).toBeNull()
        })

        expect(
            screen.getByText(
                'Categoría eliminada correctamente.'
            )
        ).toBeTruthy()
    })

    it('no elimina si el administrador cancela', async () => {
        window.confirm.mockReturnValue(false)

        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Eliminar Tortas Cuadradas'
            })
        )

        expect(eliminarCategoriaApi).not.toHaveBeenCalled()

        expect(
            screen.getByText('Tortas Cuadradas')
        ).toBeTruthy()
    })

    it('muestra el error 409 junto a la tabla', async () => {
        eliminarCategoriaApi.mockRejectedValue({
            response: {
                status: 409,
                data: {
                    mensaje:
                        'No se puede eliminar una categoría que tiene productos asociados.'
                }
            }
        })

        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Eliminar Tortas Cuadradas'
            })
        )

        const alerta = await screen.findByRole('alert')

        expect(alerta.textContent).toContain(
            'No se puede eliminar una categoría que tiene productos asociados.'
        )

        expect(
            screen.getByText('Tortas Cuadradas')
        ).toBeTruthy()

        expect(
            screen.queryByRole('button', {
                name: 'Reintentar'
            })
        ).toBeNull()
    })

    it('impide crear categorías con nombre duplicado', async () => {
        render(<CategoriasAdmin />)

        await screen.findByText('Tortas Cuadradas')

        fireEvent.change(
            screen.getByLabelText('Nombre de la categoría'),
            {
                target: {
                    value: 'Tortas Cuadradas'
                }
            }
        )

        fireEvent.change(
            screen.getByLabelText('Identificador de la categoría'),
            {
                target: {
                    value: 'nueva-categoria'
                }
            }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Crear categoría'
            })
        )

        expect(
            screen.getByText(
                'Ya existe una categoría con ese nombre.'
            )
        ).toBeTruthy()

        expect(crearCategoriaApi).not.toHaveBeenCalled()
    })

    it('muestra error y permite reintentar la carga', async () => {
        obtenerCategorias
            .mockRejectedValueOnce(
                new Error('API desconectada')
            )
            .mockResolvedValueOnce(categoriasIniciales)

        render(<CategoriasAdmin />)

        expect(
            await screen.findByText(
                'No se pudieron cargar las categorías.'
            )
        ).toBeTruthy()

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Reintentar'
            })
        )

        expect(
            await screen.findByText('Tortas Cuadradas')
        ).toBeTruthy()

        expect(obtenerCategorias).toHaveBeenCalledTimes(2)
    })
})
