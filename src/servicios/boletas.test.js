import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './api'
import { crearBoleta } from './boletas'

vi.mock('./api', () => ({ default: { post: vi.fn() } }))

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
