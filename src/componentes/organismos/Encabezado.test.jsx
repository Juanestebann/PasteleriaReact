
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/vitest'

import Encabezado from './Encabezado'

function renderizarEncabezado(props = {}) {
    return render(
        <MemoryRouter>
            <Encabezado {...props} />
        </MemoryRouter>
    )
}

afterEach(() => {
    cleanup()
})

describe('J04 - Encabezado', () => {

    // PRUEBA 1: VISITANTE
    it('muestra Iniciar Sesión cuando no hay usuario', () => {
        renderizarEncabezado({ usuario: null })

        expect(
            screen.getByRole('link', { name: 'Iniciar Sesión' })
        ).toBeInTheDocument()
    })

    // PRUEBA 2: USUARIO AUTENTICADO
    it('muestra el nombre del usuario autenticado', () => {
        renderizarEncabezado({
            usuario: { nombre: 'Juan', rol: 'CLIENTE' }
        })

        expect(
            screen.getByText('Hola, Juan')
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('link', { name: 'Iniciar Sesión' })
        ).not.toBeInTheDocument()
    })

    // PRUEBA 3: CONTADOR DEL CARRITO
    it('muestra la cantidad de productos del carrito', () => {
        renderizarEncabezado({ cantidadCarrito: 3 })

        expect(
            screen.getByRole('link', {
                name: 'Ver carrito, 3 productos'
            })
        ).toBeInTheDocument()
    })

    // PRUEBA 4: CERRAR SESIÓN
    it('ejecuta la función de cerrar sesión', async () => {
        const usuario = userEvent.setup()
        const cerrarSesion = vi.fn()

        renderizarEncabezado({
            usuario: { nombre: 'Juan' },
            onCerrarSesion: cerrarSesion
        })

        await usuario.click(
            screen.getByRole('button', {
                name: 'Cerrar sesión'
            })
        )

        expect(cerrarSesion).toHaveBeenCalledTimes(1)
    })

    // PRUEBA 5: ACTUALIZACIÓN DEL CARRITO
    it('actualiza el contador cuando cambia la cantidad recibida', () => {
        const vista = renderizarEncabezado({ cantidadCarrito: 2 })

        expect(
            screen.getByRole('link', { name: 'Ver carrito, 2 productos' })
        ).toBeInTheDocument()

        vista.rerender(
            <MemoryRouter>
                <Encabezado cantidadCarrito={5} />
            </MemoryRouter>
        )

        expect(
            screen.getByRole('link', { name: 'Ver carrito, 5 productos' })
        ).toBeInTheDocument()
    })
})

describe('J3-10 - Enlace Mis compras', () => {

    // PRUEBA 6: CLIENTE AUTENTICADO
    it('muestra Mis compras cuando el usuario es CLIENTE', () => {
        renderizarEncabezado({
            usuario: { nombre: 'Juan', rol: 'CLIENTE' }
        })

        expect(
            screen.getByRole('link', { name: 'Mis compras' })
        ).toHaveAttribute('href', '/mis-compras')
    })

    // PRUEBA 7: VISITANTE
    it('no muestra Mis compras cuando no existe sesión', () => {
        renderizarEncabezado({ usuario: null })

        expect(
            screen.queryByRole('link', { name: 'Mis compras' })
        ).not.toBeInTheDocument()
    })

    // PRUEBA 8: ADMINISTRADOR
    it('no muestra Mis compras al administrador', () => {
        renderizarEncabezado({
            usuario: { nombre: 'Administrador', rol: 'ADMINISTRADOR' }
        })

        expect(
            screen.queryByRole('link', { name: 'Mis compras' })
        ).not.toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ir al panel administrativo' })
        ).toBeInTheDocument()
    })

    // PRUEBA 9: VENDEDOR
    it('no muestra Mis compras al vendedor', () => {
        renderizarEncabezado({
            usuario: { nombre: 'Vendedor', rol: 'VENDEDOR' }
        })

        expect(
            screen.queryByRole('link', { name: 'Mis compras' })
        ).not.toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ir al panel administrativo' })
        ).toHaveAttribute('href', '/admin/productos')
    })
})
