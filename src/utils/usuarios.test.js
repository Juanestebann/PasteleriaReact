import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { leerJSON, leerUsuarios, buscarPorCredenciales, crearSesion, esPerfilInterno } from './usuarios'

describe('S06 - Usuarios y sesión en localStorage', () => {

    // Cada prueba parte con el almacenamiento vacío
    beforeEach(() => {
        localStorage.clear()
    })

    // Después de cada prueba se quitan los mocks
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('devuelve el valor por defecto si lo guardado está corrupto', () => {
        // Mock: simulamos que localStorage devuelve un texto que no es JSON
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{esto no es json')

        expect(leerJSON('usuarios', [])).toEqual([])
    })

    it('siempre incluye las cuentas de administrador y vendedor', () => {
        localStorage.setItem('usuarios', JSON.stringify([{ run: '123456785', correo: 'jose@duoc.cl' }]))

        const correos = leerUsuarios().map((usuario) => usuario.correo)

        expect(correos).toEqual(['admin@gmail.com', 'vendedor@gmail.com', 'jose@duoc.cl'])
    })

    it('encuentra al usuario con correo y contraseña correctos, sin importar mayúsculas', () => {
        const usuarios = leerUsuarios()

        expect(buscarPorCredenciales(usuarios, 'ADMIN@gmail.com', 'admin123')?.tipoUsuario).toBe('Administrador')
        expect(buscarPorCredenciales(usuarios, 'admin@gmail.com', 'otraClave')).toBeNull()
    })

    it('la sesión no guarda la contraseña y reconoce los perfiles internos', () => {
        const sesion = crearSesion({ nombre: 'Vendedor', contrasena: 'vend123', tipoUsuario: 'Vendedor' })

        expect(sesion).not.toHaveProperty('contrasena')
        expect(esPerfilInterno(sesion)).toBe(true)
        expect(esPerfilInterno({ tipoUsuario: 'Cliente' })).toBe(false)
    })
})