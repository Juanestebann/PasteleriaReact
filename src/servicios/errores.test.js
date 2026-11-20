import { describe, it, expect } from 'vitest'
import { mensajeDeError, erroresDeCampos } from './errores'

describe('S3-09 - errores.js', () => {

    it('usa el mensaje que envía la API cuando el servidor responde con error', () => {
        const error = { response: { status: 409, data: { mensaje: 'El correo ya está registrado.' } } }
        expect(mensajeDeError(error)).toBe('El correo ya está registrado.')
    })

    it('avisa que no hay conexión cuando el servidor no contesta', () => {
        expect(mensajeDeError({ request: {} })).toContain('No hay conexión con el servidor')
    })

    it('entrega los errores por campo de un 400, o un objeto vacío si no vienen', () => {
        const error = { response: { status: 400, data: { campos: { run: 'RUN inválido' } } } }
        expect(erroresDeCampos(error)).toEqual({ run: 'RUN inválido' })
        expect(erroresDeCampos({ request: {} })).toEqual({})
    })
})