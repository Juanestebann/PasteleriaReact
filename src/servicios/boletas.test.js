
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './api'
import { crearBoleta, listarBoletas, obtenerBoleta } from './boletas'

vi.mock('./api', () => ({ default: { post: vi.fn(), get: vi.fn() } }))

describe('J3-08 - servicio de boletas', () => {
    beforeEach(() => vi.clearAllMocks())

    it('envía solo códigos y cantidades al endpoint real', async () => {
        api.post.mockResolvedValue({ data: { id: 7, total: 45000 } })
        const resultado = await crearBoleta([{ codigo: 'TC001', cantidad: 1, precio: 45000 }])
        expect(api.post).toHaveBeenCalledWith('/boletas', {
            lineas: [{ codigo: 'TC001', cantidad: 1 }], cupon: null
        })
        expect(resultado.id).toBe(7)
    })

    it('incluye el cupón aplicado y propaga errores de la API', async () => {
        api.post.mockRejectedValue(new Error('Sin conexión'))
        await expect(crearBoleta([{ codigo: 'TC001', cantidad: 2 }], 'felices10'))
            .rejects.toThrow('Sin conexión')
        expect(api.post).toHaveBeenCalledWith('/boletas', {
            lineas: [{ codigo: 'TC001', cantidad: 2 }], cupon: 'felices10'
        })
    })
})

describe('J3-09 - consultas de órdenes', () => {
    beforeEach(() => vi.clearAllMocks())

    it('lista todas las boletas usando GET /boletas', async () => {
        api.get.mockResolvedValue({ data: [{ id: 4 }] })
        await expect(listarBoletas()).resolves.toEqual([{ id: 4 }])
        expect(api.get).toHaveBeenCalledWith('/boletas')
    })

    it('consulta una boleta por ID y propaga errores', async () => {
        api.get.mockResolvedValueOnce({ data: { id: 4, detalle: [] } })
        await expect(obtenerBoleta(4)).resolves.toEqual({ id: 4, detalle: [] })
        expect(api.get).toHaveBeenCalledWith('/boletas/4')
        api.get.mockRejectedValueOnce(new Error('Sin conexión'))
        await expect(obtenerBoleta(4)).rejects.toThrow('Sin conexión')
    })
})
