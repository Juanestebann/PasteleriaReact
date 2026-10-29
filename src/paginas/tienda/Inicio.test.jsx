
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/vitest'

import Inicio from './Inicio'
import { productosIniciales } from '../../datos/productos'

// Limpia el DOM después de cada prueba
afterEach(() => {
    cleanup()
})

// Renderiza Inicio dentro de React Router
function renderizarInicio() {
    return render(
        <MemoryRouter>
            <Inicio />
        </MemoryRouter>
    )
}

describe('J06 - Página Inicio', () => {

    // PRUEBA 1: HERO PRINCIPAL
    it('muestra el título principal y el botón Ver carta', () => {
        renderizarInicio()

        expect(
            screen.getByRole('heading', {
                name: /Disfruta lo mejor de nuestra pastelería/i
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ver carta' })
        ).toHaveAttribute('href', '/productos')
    })

    // PRUEBA 2: BENEFICIOS
    it('muestra los tres beneficios originales', () => {
        renderizarInicio()

        expect(
            screen.getByText(/Repostería artesanal/i)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/Pide por WhatsApp/i)
        ).toBeInTheDocument()

        expect(
            screen.getByText(/Visítanos/i)
        ).toBeInTheDocument()
    })

    // PRUEBA 3: PRODUCTOS DESTACADOS
    it('renderiza ocho productos destacados', () => {
        renderizarInicio()

        const catalogo = document.querySelector('#productos')

        expect(catalogo).not.toBeNull()

        const productos = catalogo.querySelectorAll('article.producto-completo')

        expect(productos).toHaveLength(8)
    })

    // PRUEBA 4: ENLACES A PRODUCTOS
    it('muestra los enlaces correctos de cada producto', () => {
        renderizarInicio()

        const codigos = [
            'TC001',
            'TC002',
            'TT001',
            'TT002',
            'PI001',
            'PI002',
            'PSA001',
            'PSA002'
        ]

        const catalogo = document.querySelector('#productos')

        const enlaces = within(catalogo).getAllByRole('link', {
            name: 'Ver detalle'
        })

        expect(enlaces).toHaveLength(8)

        codigos.forEach((codigo) => {
            expect(
                enlaces.some(
                    (enlace) =>
                        enlace.getAttribute('href') === `/producto/${codigo}`
                )
            ).toBe(true)
        })
    })

    it('utiliza el inventario guardado y sus precios actualizados', () => {
        const editado = { ...productosIniciales[0], nombre: 'Torta de temporada', precio: 39000 }
        localStorage.setItem('productos', JSON.stringify([editado]))
        try {
            renderizarInicio()
            expect(screen.getByText('Torta de temporada')).toBeInTheDocument()
            expect(screen.getByText('$39.000 CLP')).toBeInTheDocument()
            expect(document.querySelectorAll('#productos article.producto-completo')).toHaveLength(1)
        } finally {
            localStorage.removeItem('productos')
        }
    })

    // PRUEBA 5: PROMOCIÓN
    it('muestra la promoción 50 Aniversario', () => {
        renderizarInicio()

        expect(
            screen.getByRole('heading', { name: '50 Aniversario' })
        ).toBeInTheDocument()

        expect(
            screen.getByText('FELICES50')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Registrarme' })
        ).toHaveAttribute('href', '/registro')
    })

})
