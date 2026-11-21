import { describe, expect, it } from 'vitest'
import { ROLES, obtenerRol, esAdministrador, esVendedor, esPersonalInterno } from './roles'

describe('J3-07 - Roles compartidos con backend', () => {
    it('reconoce los tres roles enviados por la API', () => {
        expect(obtenerRol({ rol: 'ADMINISTRADOR' })).toBe(ROLES.ADMINISTRADOR)
        expect(obtenerRol({ rol: 'VENDEDOR' })).toBe(ROLES.VENDEDOR)
        expect(obtenerRol({ rol: 'CLIENTE' })).toBe(ROLES.CLIENTE)
    })
    it('mantiene compatibilidad con tipoUsuario', () => {
        expect(obtenerRol({ tipoUsuario: 'Administrador' })).toBe(ROLES.ADMINISTRADOR)
        expect(obtenerRol({ tipoUsuario: 'Vendedor' })).toBe(ROLES.VENDEDOR)
        expect(obtenerRol({ tipoUsuario: 'Cliente' })).toBe(ROLES.CLIENTE)
    })
    it('solo permite perfiles internos al panel', () => {
        expect(esPersonalInterno({ rol: ROLES.CLIENTE })).toBe(false)
        expect(esPersonalInterno({ rol: ROLES.VENDEDOR })).toBe(true)
        expect(esAdministrador({ rol: ROLES.ADMINISTRADOR })).toBe(true)
        expect(esVendedor({ rol: ROLES.ADMINISTRADOR })).toBe(false)
        expect(obtenerRol({ rol: 'OTRO' })).toBe(null)
    })
})
