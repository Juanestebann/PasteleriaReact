import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/vitest'
import MenuAdmin from './MenuAdmin'

function mostrar(sesion) {
    render(<MemoryRouter><MenuAdmin sesion={sesion} /></MemoryRouter>)
}
afterEach(cleanup)
describe('J3-07 - Menú por rol', () => {
    it('administrador ve inicio, productos y usuarios', () => {
        mostrar({ rol: 'ADMINISTRADOR' })
        expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Productos' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Órdenes' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Usuarios' })).toBeInTheDocument()
    })
    it('vendedor ve productos sin inicio ni usuarios', () => {
        mostrar({ rol: 'VENDEDOR' })
        expect(screen.getByRole('link', { name: 'Productos' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Órdenes' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Inicio' })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
    })
})
