
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import Nosotros from './Nosotros'

// Limpiar el DOM después de cada prueba
afterEach(() => {
    cleanup()
})

describe('J07 - Página Nosotros', () => {

    // PRUEBA 1: TÍTULO PRINCIPAL
    it('muestra el título principal de Nosotros', () => {
        render(<Nosotros />)

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Sobre Pastelería Mil Sabores'
            })
        ).toBeInTheDocument()
    })

    // PRUEBA 2: IMAGEN ACCESIBLE
    it('muestra el logo con texto alternativo', () => {
        render(<Nosotros />)

        expect(
            screen.getByRole('img', {
                name: 'Logo de Pastelería Mil Sabores'
            })
        ).toHaveAttribute(
            'src',
            '/img/NosotrosLogo.png'
        )
    })

    // PRUEBA 3: SECCIONES
    it('muestra las secciones principales', () => {
        render(<Nosotros />)

        const titulos = [
            'Nuestra historia',
            'Nuestra misión',
            'Nuestros valores',
            'Desarrolladores',
            'Nuestro compromiso'
        ]

        titulos.forEach((titulo) => {
            expect(
                screen.getByRole('heading', { name: titulo })
            ).toBeInTheDocument()
        })
    })

    // PRUEBA 4: VALORES
    it('muestra los tres valores de la pastelería', () => {
        render(<Nosotros />)

        const valores = document.querySelector('#lista-valores')

        expect(valores).not.toBeNull()

        const valoresEsperados = [
            'Calidad',
            'Cercanía',
            'Compromiso'
        ]

        valoresEsperados.forEach((valor) => {
            expect(
                within(valores).getByRole('heading', { name: valor })
            ).toBeInTheDocument()
        })
    })

    // PRUEBA 5: DESARROLLADORES
    it('muestra los tres desarrolladores originales', () => {
        render(<Nosotros />)

        const desarrolladores = document.querySelector(
            '#lista-desarrolladores'
        )

        expect(desarrolladores).not.toBeNull()

        const nombres = [
            'Catalina Díaz Moraga',
            'José Cardoza Miranda',
            'Juan Núñez Sánchez'
        ]

        nombres.forEach((nombre) => {
            expect(
                within(desarrolladores).getByRole('heading', {
                    name: nombre
                })
            ).toBeInTheDocument()
        })
    })

})
