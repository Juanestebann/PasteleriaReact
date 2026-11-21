
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
    leerJSON,
    leerUsuarios,
    crearSesion,
    crearSesionDesdeApi,
    esPerfilInterno,
    obtenerIniciales,
    claseRol,
    formatearFecha,
} from './usuarios'
import { ROLES } from './roles'

describe('S06 - Usuarios y sesión en localStorage', () => {

    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('devuelve el valor por defecto si lo guardado está corrupto', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('{esto no es json')

        expect(leerJSON('usuarios', [])).toEqual([])
    })

    it('siempre incluye las cuentas de administrador y vendedor', () => {
        localStorage.setItem('usuarios', JSON.stringify([
            { run: '123456785', correo: 'jose@duoc.cl' }
        ]))

        const correos = leerUsuarios().map((usuario) => usuario.correo)

        expect(correos).toEqual([
            'admin@gmail.com',
            'vendedor@gmail.com',
            'jose@duoc.cl'
        ])
    })

    it('si una cuenta interna fue editada, se respeta la versión editada', () => {
        const vendedorEditado = {
            run: '222222222',
            nombre: 'Vendedora',
            correo: 'vendedor@gmail.com',
            tipoUsuario: 'Vendedor'
        }

        localStorage.setItem('usuarios', JSON.stringify([vendedorEditado]))

        const usuarios = leerUsuarios()

        expect(usuarios).toHaveLength(2)
        expect(
            usuarios.find((usuario) => usuario.run === '222222222').nombre
        ).toBe('Vendedora')
    })

    it('arma la sesión desde la API con los tokens y el rol visible', () => {
        const sesion = crearSesionDesdeApi({
            accessToken: 'token',
            refreshToken: 'refresh',
            usuario: {
                run: '111111111',
                nombre: 'Administrador',
                fechaNacimiento: null,
                rol: ROLES.ADMINISTRADOR
            },
        })

        expect(sesion.rol).toBe(ROLES.ADMINISTRADOR)
        expect(sesion.tipoUsuario).toBe('Administrador')
        expect(sesion.accessToken).toBe('token')
        expect(sesion.refreshToken).toBe('refresh')
        expect(sesion.fechaNacimiento).toBe('')
        expect(sesion).not.toHaveProperty('contrasena')
        expect(esPerfilInterno(sesion)).toBe(true)
    })

    it('la sesión no guarda la contraseña y reconoce los perfiles internos', () => {
        const sesion = crearSesion({
            nombre: 'Vendedor',
            contrasena: 'vend123',
            tipoUsuario: 'Vendedor'
        })

        expect(sesion).not.toHaveProperty('contrasena')
        expect(esPerfilInterno(sesion)).toBe(true)
        expect(esPerfilInterno({ tipoUsuario: 'Cliente' })).toBe(false)
    })

    it('arma las iniciales, la clase del rol y la fecha para mostrar', () => {
        expect(obtenerIniciales({
            nombre: 'José',
            apellidos: 'Cardoza'
        })).toBe('JC')

        expect(claseRol('Vendedor')).toBe('rol rol-vendedor')
        expect(claseRol(undefined)).toBe('rol rol-cliente')
        expect(formatearFecha('2004-03-15')).toBe('15-03-2004')
        expect(formatearFecha('')).toBe('-')
    })

    // J3-07: nuevas pruebas de roles.

    it('reconoce al vendedor recibido desde la API', () => {
        const sesion = crearSesionDesdeApi({
            accessToken: 'token-vendedor',
            refreshToken: 'refresh-vendedor',
            usuario: {
                nombre: 'Vendedor',
                rol: ROLES.VENDEDOR
            }
        })

        expect(sesion.rol).toBe(ROLES.VENDEDOR)
        expect(sesion.tipoUsuario).toBe('Vendedor')
        expect(esPerfilInterno(sesion)).toBe(true)
    })

    it('reconoce al cliente recibido desde la API', () => {
        const sesion = crearSesionDesdeApi({
            accessToken: 'token-cliente',
            refreshToken: 'refresh-cliente',
            usuario: {
                nombre: 'Cliente',
                rol: ROLES.CLIENTE
            }
        })

        expect(sesion.rol).toBe(ROLES.CLIENTE)
        expect(sesion.tipoUsuario).toBe('Cliente')
        expect(esPerfilInterno(sesion)).toBe(false)
    })

    it('mantiene compatibilidad con los roles anteriores', () => {
        expect(esPerfilInterno({
            tipoUsuario: 'Administrador'
        })).toBe(true)

        expect(esPerfilInterno({
            tipoUsuario: 'Vendedor'
        })).toBe(true)

        expect(esPerfilInterno({
            tipoUsuario: 'Cliente'
        })).toBe(false)
    })
})
