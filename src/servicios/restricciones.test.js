/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios, { AxiosError } from 'axios'
import api from './api'
import { guardarSesion, leerSesion } from './sesion'

describe('J3-11 - sesión y restricciones de la API', () => {
    const adaptadorOriginal = api.defaults.adapter

    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
        guardarSesion({
            accessToken: 'access-valido',
            refreshToken: 'refresh-valido',
            usuario: { correo: 'cliente@ejemplo.cl', tipoUsuario: 'Cliente' }
        })
    })

    afterEach(() => {
        api.defaults.adapter = adaptadorOriginal
        localStorage.clear()
        vi.restoreAllMocks()
    })

    function rechazarConEstado(estado) {
        return vi.fn(async (config) => {
            throw new AxiosError('Petición rechazada', 'ERR_BAD_RESPONSE', config, null, {
                data: { status: estado },
                status: estado,
                statusText: estado === 403 ? 'Forbidden' : 'Unauthorized',
                headers: {},
                config
            })
        })
    }

    it('un 403 conserva la sesión y no intenta renovar el token', async () => {
        const renovar = vi.spyOn(axios, 'post')
        api.defaults.adapter = rechazarConEstado(403)

        await expect(api.get('/boletas/12')).rejects.toMatchObject({
            response: { status: 403 }
        })

        expect(renovar).not.toHaveBeenCalled()
        expect(leerSesion().accessToken).toBe('access-valido')
    })

    it('un 401 sin refresh token limpia la sesión', async () => {
        guardarSesion({
            accessToken: 'access-vencido',
            usuario: { correo: 'cliente@ejemplo.cl' }
        })
        api.defaults.adapter = rechazarConEstado(401)
        const evento = vi.fn()
        window.addEventListener('sesion-expirada', evento, { once: true })

        await expect(api.get('/boletas/mias')).rejects.toMatchObject({
            response: { status: 401 }
        })

        expect(leerSesion()).toBeNull()
        expect(evento).toHaveBeenCalledTimes(1)
    })
})
