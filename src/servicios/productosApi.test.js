
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './api'
import {
    obtenerProductos,
    obtenerProductoPorCodigo,
    obtenerProductosStockCritico,
    crearProductoApi,
    actualizarProductoApi,
    eliminarProductoApi
} from './productosApi'

// C3-07: simular las peticiones HTTP sin modificar la base de datos.
vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}))

describe('C3-07 - Servicio API de productos', () => {

    const productoEjemplo = {
        id: 18,
        codigo: 'TEST001',
        nombre: 'Producto de prueba',
        descripcion: 'Producto utilizado para pruebas',
        precio: 15000,
        stock: 10,
        stockCritico: 3,
        imagen: '/img/producto-prueba.png',
        categoria: 'cuadradas'
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('obtiene todos los productos desde la API', async () => {
        api.get.mockResolvedValue({
            data: [productoEjemplo]
        })

        const resultado = await obtenerProductos()

        expect(api.get).toHaveBeenCalledWith('/productos', {
            params: {}
        })

        expect(resultado).toEqual([productoEjemplo])
    })

    it('filtra los productos por categoría', async () => {
        api.get.mockResolvedValue({
            data: [productoEjemplo]
        })

        const resultado = await obtenerProductos('cuadradas')

        expect(api.get).toHaveBeenCalledWith('/productos', {
            params: {
                categoria: 'cuadradas'
            }
        })

        expect(resultado).toEqual([productoEjemplo])
    })

    it('obtiene un producto utilizando su código', async () => {
        api.get.mockResolvedValue({
            data: productoEjemplo
        })

        const resultado = await obtenerProductoPorCodigo('TEST001')

        expect(api.get).toHaveBeenCalledWith(
            '/productos/codigo/TEST001'
        )

        expect(resultado).toEqual(productoEjemplo)
    })

    it('obtiene los productos con stock crítico', async () => {
        const productoCritico = {
            ...productoEjemplo,
            stock: 2
        }

        api.get.mockResolvedValue({
            data: [productoCritico]
        })

        const resultado = await obtenerProductosStockCritico()

        expect(api.get).toHaveBeenCalledWith(
            '/productos/stock-critico'
        )

        expect(resultado).toEqual([productoCritico])
    })

    it('crea un producto mediante POST', async () => {
        const nuevoProducto = {
            ...productoEjemplo
        }

        delete nuevoProducto.id

        api.post.mockResolvedValue({
            data: productoEjemplo
        })

        const resultado = await crearProductoApi(nuevoProducto)

        expect(api.post).toHaveBeenCalledWith(
            '/productos',
            nuevoProducto
        )

        expect(resultado).toEqual(productoEjemplo)
    })

    it('actualiza un producto mediante PUT utilizando su ID', async () => {
        const productoActualizado = {
            ...productoEjemplo,
            nombre: 'Producto actualizado',
            precio: 18000
        }

        api.put.mockResolvedValue({
            data: productoActualizado
        })

        const resultado = await actualizarProductoApi(
            18,
            productoActualizado
        )

        expect(api.put).toHaveBeenCalledWith(
            '/productos/18',
            productoActualizado
        )

        expect(resultado).toEqual(productoActualizado)
    })

    it('elimina un producto mediante DELETE utilizando su ID', async () => {
        api.delete.mockResolvedValue({
            data: null
        })

        await eliminarProductoApi(18)

        expect(api.delete).toHaveBeenCalledWith(
            '/productos/18'
        )
    })

    it('propaga los errores de conexión al consultar productos', async () => {
        const errorConexion = new Error(
            'No se pudo conectar con Spring Boot'
        )

        api.get.mockRejectedValue(errorConexion)

        await expect(
            obtenerProductos()
        ).rejects.toThrow(
            'No se pudo conectar con Spring Boot'
        )
    })

    it('propaga un error HTTP 409 al crear un producto duplicado', async () => {
        const errorDuplicado = {
            response: {
                status: 409,
                data: {
                    mensaje: 'El código ya está registrado'
                }
            }
        }

        api.post.mockRejectedValue(errorDuplicado)

        await expect(
            crearProductoApi(productoEjemplo)
        ).rejects.toEqual(errorDuplicado)
    })

    it('propaga un error HTTP 400 al enviar datos inválidos', async () => {
        const errorValidacion = {
            response: {
                status: 400,
                data: {
                    mensaje: 'El precio debe ser mayor que cero'
                }
            }
        }

        api.post.mockRejectedValue(errorValidacion)

        await expect(
            crearProductoApi({
                ...productoEjemplo,
                precio: 0
            })
        ).rejects.toEqual(errorValidacion)
    })

    it('propaga un error HTTP 403 si el usuario no tiene permisos', async () => {
        const errorPermisos = {
            response: {
                status: 403,
                data: {
                    mensaje: 'Acceso denegado'
                }
            }
        }

        api.delete.mockRejectedValue(errorPermisos)

        await expect(
            eliminarProductoApi(18)
        ).rejects.toEqual(errorPermisos)
    })
})
