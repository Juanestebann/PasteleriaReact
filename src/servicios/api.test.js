
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios, { AxiosError } from 'axios'
import api from './api'
import { leerSesion, guardarSesion } from './sesion'

describe('J3-04 - Interceptores de Axios', () => {
    const adaptadorOriginal = api.defaults.adapter

    const sesionInicial = {
        accessToken: 'token-antiguo',
        refreshToken: 'refresh-valido',
        usuario: { correo: 'admin@gmail.com' }
    }

    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
        guardarSesion(sesionInicial)
    })

    afterEach(() => {
        api.defaults.adapter = adaptadorOriginal
        localStorage.clear()
        vi.restoreAllMocks()
    })

    function respuestaExitosa(config) {
        return {
            data: { correcto: true },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
        }
    }

    function error401(config) {
        return new AxiosError(
            'No autorizado',
            'ERR_BAD_REQUEST',
            config,
            null,
            {
                data: {},
                status: 401,
                statusText: 'Unauthorized',
                headers: {},
                config
            }
        )
    }

    it('agrega automáticamente el access token', async () => {
        const adaptador = vi.fn(async (config) => respuestaExitosa(config))
        api.defaults.adapter = adaptador

        await api.get('/auth/me')

        expect(adaptador.mock.calls[0][0].headers.get('Authorization'))
            .toBe('Bearer token-antiguo')
    })

    it('no agrega Authorization cuando no existe sesión', async () => {
        localStorage.clear()

        const adaptador = vi.fn(async (config) => respuestaExitosa(config))
        api.defaults.adapter = adaptador

        await api.get('/productos')

        expect(adaptador.mock.calls[0][0].headers.get('Authorization'))
            .toBeUndefined()
    })

    it('renueva el token después de un 401 y repite la petición', async () => {
        const renovar = vi.spyOn(axios, 'post').mockResolvedValue({
            data: {
                accessToken: 'token-nuevo',
                refreshToken: 'refresh-nuevo'
            }
        })

        const adaptador = vi.fn(async (config) => {
            if (!config._reintentado) {
                throw error401(config)
            }
            return respuestaExitosa(config)
        })

        api.defaults.adapter = adaptador

        const resultado = await api.get('/auth/me')

        expect(renovar).toHaveBeenCalledWith(
            'http://localhost:8080/api/v1/auth/refresh',
            { refreshToken: 'refresh-valido' }
        )
        expect(adaptador).toHaveBeenCalledTimes(2)
        expect(resultado.status).toBe(200)
        expect(leerSesion().accessToken).toBe('token-nuevo')
        expect(leerSesion().refreshToken).toBe('refresh-nuevo')
        expect(adaptador.mock.calls[1][0].headers.get('Authorization'))
            .toBe('Bearer token-nuevo')
    })

    it('borra la sesión cuando falla la renovación', async () => {
        vi.spyOn(axios, 'post').mockRejectedValue(
            new Error('Refresh expirado')
        )

        api.defaults.adapter = vi.fn(async (config) => {
            throw error401(config)
        })

        const evento = vi.fn()
        window.addEventListener('sesion-expirada', evento, { once: true })

        await expect(api.get('/auth/me')).rejects.toThrow(
            'Refresh expirado'
        )

        expect(leerSesion()).toBeNull()
        expect(evento).toHaveBeenCalledTimes(1)
    })

    it('realiza una sola renovación para peticiones simultáneas', async () => {
        const renovar = vi.spyOn(axios, 'post').mockResolvedValue({
            data: {
                accessToken: 'token-compartido',
                refreshToken: 'refresh-nuevo'
            }
        })

        const adaptador = vi.fn(async (config) => {
            if (!config._reintentado) {
                throw error401(config)
            }
            return respuestaExitosa(config)
        })

        api.defaults.adapter = adaptador

        const resultados = await Promise.all([
            api.get('/usuarios'),
            api.get('/boletas'),
            api.get('/auth/me')
        ])

        expect(renovar).toHaveBeenCalledTimes(1)
        expect(adaptador).toHaveBeenCalledTimes(6)
        expect(resultados.every((r) => r.status === 200)).toBe(true)
    })

    it('no intenta renovar cuando el login devuelve 401', async () => {
        const renovar = vi.spyOn(axios, 'post')

        api.defaults.adapter = vi.fn(async (config) => {
            throw error401(config)
        })

        await expect(
            api.post('/auth/login', {
                correo: 'admin@gmail.com',
                contrasena: 'incorrecta'
            })
        ).rejects.toMatchObject({
            response: { status: 401 }
        })

        expect(renovar).not.toHaveBeenCalled()
    })
})
