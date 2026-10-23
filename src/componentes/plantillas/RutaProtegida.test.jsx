
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import RutaProtegida from './RutaProtegida'

function renderizarRuta({ sesion = null, perfilesPermitidos = ['Administrador'], ruta = '/admin' } = {}) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/login" element={<h1>Iniciar sesión</h1>} />
                <Route
                    element={
                        <RutaProtegida
                            sesion={sesion}
                            perfilesPermitidos={perfilesPermitidos}
                        />
                    }
                >
                    <Route path="/admin" element={<h1>Panel administrativo</h1>} />
                </Route>
            </Routes>
        </MemoryRouter>
    )
}

describe('J12 - RutaProtegida', () => {
    it('redirige al login cuando el visitante no tiene sesión', () => {
        renderizarRuta()

        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
        expect(screen.queryByText('Panel administrativo')).not.toBeInTheDocument()
    })

    it('deniega el acceso a un Cliente', () => {
        renderizarRuta({
            sesion: { tipoUsuario: 'Cliente' },
            perfilesPermitidos: ['Administrador', 'Vendedor'],
        })

        expect(screen.getByText(/403 - Acceso denegado/i)).toBeInTheDocument()
        expect(screen.queryByText('Panel administrativo')).not.toBeInTheDocument()
    })

    it('permite el acceso a un Administrador', () => {
        renderizarRuta({
            sesion: { tipoUsuario: 'Administrador' },
        })

        expect(screen.getByText('Panel administrativo')).toBeInTheDocument()
    })

    it('permite el acceso a un Vendedor cuando está autorizado', () => {
        renderizarRuta({
            sesion: { tipoUsuario: 'Vendedor' },
            perfilesPermitidos: ['Administrador', 'Vendedor'],
        })

        expect(screen.getByText('Panel administrativo')).toBeInTheDocument()
    })

    it('deniega el acceso al Vendedor en rutas exclusivas del Administrador', () => {
        renderizarRuta({
            sesion: { tipoUsuario: 'Vendedor' },
            perfilesPermitidos: ['Administrador'],
        })

        expect(screen.getByText(/403 - Acceso denegado/i)).toBeInTheDocument()
    })

    it('deniega el acceso a un perfil desconocido', () => {
        renderizarRuta({
            sesion: { tipoUsuario: 'Desconocido' },
            perfilesPermitidos: ['Administrador', 'Vendedor'],
        })

        expect(screen.getByText(/403 - Acceso denegado/i)).toBeInTheDocument()
    })
})
