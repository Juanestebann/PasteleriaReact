import { describe, it, expect } from 'vitest'
import { validarRun, validarCorreo, validarContrasena, validarConfirmacion } from './validaciones'

describe('S01 - Validaciones', () => {

    it('acepta un RUN con dígito verificador correcto', () => {
        expect(validarRun('123456785')).toBe('')
    })

    it('rechaza un RUN con dígito verificador incorrecto', () => {
        expect(validarRun('123456789')).toBe('Ingrese un RUN válido, sin puntos ni guion.')
    })

    it('acepta los tres dominios de correo permitidos', () => {
        expect(validarCorreo('ana@duoc.cl')).toBe('')
        expect(validarCorreo('profe@profesor.duoc.cl')).toBe('')
        expect(validarCorreo('ana@gmail.com')).toBe('')
    })

    it('rechaza un correo con otro dominio', () => {
        expect(validarCorreo('ana@hotmail.com')).toBe('Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.')
    })

    it('exige una contraseña de 4 a 10 caracteres', () => {
        expect(validarContrasena('123')).toBe('La contraseña debe tener entre 4 y 10 caracteres.')
        expect(validarContrasena('1234')).toBe('')
    })

    it('detecta cuando las contraseñas no coinciden', () => {
        expect(validarConfirmacion('clave123', 'clave124')).toBe('Las contraseñas no coinciden.')
    })
})