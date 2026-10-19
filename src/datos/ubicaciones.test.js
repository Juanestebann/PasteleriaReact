import { describe, it, expect } from 'vitest'
import { regiones, obtenerComunas } from './ubicaciones'

describe('S02 - Regiones y comunas', () => {

    it('contiene las 16 regiones de Chile', () => {
        expect(regiones).toHaveLength(16)
    })

    it('devuelve las comunas de la región elegida', () => {
        const comunas = obtenerComunas('Región de Ñuble')
        expect(comunas).toContain('Chillán')
        expect(comunas).not.toContain('Concepción')
    })

    it('devuelve una lista vacía si la región no existe', () => {
        expect(obtenerComunas('Región inventada')).toEqual([])
    })
})