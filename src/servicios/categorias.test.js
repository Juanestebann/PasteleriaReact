
import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from 'vitest'

import api from './api'

import {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoriaApi,
    actualizarCategoriaApi,
    eliminarCategoriaApi
} from './categorias'

// Simulamos Axios para no modificar la base de datos
// durante las pruebas automatizadas.
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}))

describe('C3-09 - Servicio de categorías', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('obtiene las categorías desde la API', async () => {
        const categorias = [
            {
                id: 1,
                slug: 'cuadradas',
                nombre: 'Tortas Cuadradas'
            },
            {
                id: 2,
                slug: 'circulares',
                nombre: 'Tortas Circulares'
            }
        ]

        api.get.mockResolvedValue({
            data: categorias
        })

        const resultado = await obtenerCategorias()

        expect(api.get).toHaveBeenCalledWith(
            '/categorias'
        )

        expect(resultado).toEqual(categorias)
    })

    it('consulta una categoría mediante su ID', async () => {
        const categoria = {
            id: 1,
            slug: 'cuadradas',
            nombre: 'Tortas Cuadradas'
        }

        api.get.mockResolvedValue({
            data: categoria
        })

        const resultado = await obtenerCategoriaPorId(1)

        expect(api.get).toHaveBeenCalledWith(
            '/categorias/1'
        )

        expect(resultado).toEqual(categoria)
    })

    it('crea una categoría mediante POST', async () => {
        const nuevaCategoria = {
            slug: 'prueba',
            nombre: 'Categoría de Prueba'
        }

        const categoriaCreada = {
            id: 10,
            ...nuevaCategoria
        }

        api.post.mockResolvedValue({
            data: categoriaCreada
        })

        const resultado = await crearCategoriaApi(
            nuevaCategoria
        )

        expect(api.post).toHaveBeenCalledWith(
            '/categorias',
            nuevaCategoria
        )

        expect(resultado).toEqual(categoriaCreada)
    })

    it('actualiza una categoría mediante PUT', async () => {
        const datos = {
            slug: 'prueba',
            nombre: 'Categoría de Prueba Editada'
        }

        const categoriaActualizada = {
            id: 10,
            ...datos
        }

        api.put.mockResolvedValue({
            data: categoriaActualizada
        })

        const resultado = await actualizarCategoriaApi(
            10,
            datos
        )

        expect(api.put).toHaveBeenCalledWith(
            '/categorias/10',
            datos
        )

        expect(resultado).toEqual(
            categoriaActualizada
        )
    })

    it('elimina una categoría mediante DELETE', async () => {
        api.delete.mockResolvedValue({
            status: 204
        })

        await eliminarCategoriaApi(10)

        expect(api.delete).toHaveBeenCalledWith(
            '/categorias/10'
        )
    })

    it('propaga el error 409 al eliminar una categoría con productos', async () => {
        const error = {
            response: {
                status: 409,
                data: {
                    mensaje:
                        'No se puede eliminar una categoría que tiene productos asociados.'
                }
            }
        }

        api.delete.mockRejectedValue(error)

        await expect(
            eliminarCategoriaApi(1)
        ).rejects.toEqual(error)

        expect(api.delete).toHaveBeenCalledWith(
            '/categorias/1'
        )
    })

    it('propaga los errores de conexión al consultar categorías', async () => {
        const error = new Error(
            'No hay conexión con Spring Boot'
        )

        api.get.mockRejectedValue(error)

        await expect(
            obtenerCategorias()
        ).rejects.toThrow(
            'No hay conexión con Spring Boot'
        )
    })
})
