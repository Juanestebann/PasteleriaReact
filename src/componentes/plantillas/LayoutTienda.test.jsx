
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import '@testing-library/jest-dom/vitest'

import LayoutTienda from './LayoutTienda'

afterEach(() => {
    cleanup()
})

describe('J05 - LayoutTienda', () => {

    const rutas = ['/', '/productos', '/blogs']

    rutas.forEach((ruta) => {

        it(`muestra encabezado y footer una sola vez en ${ruta}`, () => {

            render(
                <MemoryRouter initialEntries={[ruta]}>
                    <Routes>
                        <Route element={<LayoutTienda />}>
                            <Route path="/" element={<p>Inicio de prueba</p>} />
                            <Route path="/productos" element={<p>Catálogo de prueba</p>} />
                            <Route path="/blogs" element={<p>Blogs de prueba</p>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            )

            // Verificar encabezado único
            expect(
                document.querySelectorAll('header')
            ).toHaveLength(1)

            // Verificar footer único
            expect(
                document.querySelectorAll('footer')
            ).toHaveLength(1)

            // Verificar contenido de la página
            expect(
                screen.getByText(/de prueba/i)
            ).toBeInTheDocument()

        })
    })
})
