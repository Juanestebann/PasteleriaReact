import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Login from './Login'

// Dibuja Login dentro de un router de prueba, con las páginas de destino
function renderizarLogin(onIniciarSesion) {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<Login onIniciarSesion={onIniciarSesion} />} />
                <Route path="/admin" element={<h1>Panel de administración</h1>} />
                <Route path="/" element={<h1>Inicio de la tienda</h1>} />
            </Routes>
        </MemoryRouter>
    )
}

// Escribe el correo y la contraseña y presiona el botón
async function ingresar(usuario, correo, contrasena) {
    await usuario.type(screen.getByLabelText('Correo electrónico'), correo)
    await usuario.type(screen.getByLabelText('Contraseña'), contrasena)
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('S06 - Página Login', () => {

    it('un Administrador entra al panel de administración', async () => {
        const usuario = userEvent.setup()
        // Mock: simula que App encontró a un administrador
        const onIniciarSesion = vi.fn().mockReturnValue({ nombre: 'Administrador', tipoUsuario: 'Administrador' })

        renderizarLogin(onIniciarSesion)
        await ingresar(usuario, 'admin@gmail.com', 'admin123')

        expect(onIniciarSesion).toHaveBeenCalledWith('admin@gmail.com', 'admin123')
        expect(screen.getByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument()
    })

    it('un Cliente vuelve al inicio de la tienda', async () => {
        const usuario = userEvent.setup()
        // Mock: simula que App encontró a un cliente
        const onIniciarSesion = vi.fn().mockReturnValue({ nombre: 'José', tipoUsuario: 'Cliente' })

        renderizarLogin(onIniciarSesion)
        await ingresar(usuario, 'jose@duoc.cl', 'clave123')

        expect(screen.getByRole('heading', { name: 'Inicio de la tienda' })).toBeInTheDocument()
    })
})