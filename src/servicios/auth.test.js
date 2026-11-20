import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from './api'
import { login, registrar, refrescar, obtenerUsuarioActual } from './auth'

// Se reemplaza la instancia de axios: las pruebas no llaman a la API real
vi.mock('./api', () => ({ default: { post: vi.fn(), get: vi.fn() } }))

describe('S3-09 - servicio auth.js', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('login hace POST /auth/login y devuelve los datos de la respuesta', async () => {
        api.post.mockResolvedValue({ data: { accessToken: 'abc', usuario: { rol: 'CLIENTE' } } })

        const resultado = await login('ana@gmail.com', 'clave123')

        expect(api.post).toHaveBeenCalledWith('/auth/login', { correo: 'ana@gmail.com', contrasena: 'clave123' })
        expect(resultado.accessToken).toBe('abc')
    })

    it('registrar envía solo los campos de la API y la fecha vacía como null', async () => {
        api.post.mockResolvedValue({ data: {} })

        await registrar({
            run: '123456785', nombre: 'José', apellidos: 'Cardoza', correo: 'jose@duoc.cl',
            contrasena: 'clave123', confirmarContrasena: 'clave123', tipoUsuario: 'Cliente',
            fechaNacimiento: '', region: 'Región del Biobío', comuna: 'Concepción', direccion: 'Calle 1',
        })

        const enviado = api.post.mock.calls[0][1]
        expect(api.post.mock.calls[0][0]).toBe('/auth/registro')
        expect(enviado.fechaNacimiento).toBeNull()
        expect(enviado).not.toHaveProperty('confirmarContrasena')
        expect(enviado).not.toHaveProperty('tipoUsuario')
    })

    it('refrescar y obtenerUsuarioActual usan sus rutas', async () => {
        api.post.mockResolvedValue({ data: { accessToken: 'nuevo' } })
        api.get.mockResolvedValue({ data: { correo: 'admin@gmail.com' } })

        await refrescar('token-refresh')
        const yo = await obtenerUsuarioActual('token-access')

        expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'token-refresh' })
        expect(api.get).toHaveBeenCalledWith('/auth/me', { headers: { Authorization: 'Bearer token-access' } })
        expect(yo.correo).toBe('admin@gmail.com')
    })
})