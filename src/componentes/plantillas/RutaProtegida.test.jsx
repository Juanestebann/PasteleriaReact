import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router'
import RutaProtegida from './RutaProtegida'
import AccesoDenegado from '../../paginas/tienda/AccesoDenegado'

function LoginSimulado() {
    const ubicacion = useLocation()
    return <h1>Iniciar sesión: {ubicacion.state?.from?.pathname ?? 'sin destino'}</h1>
}

function renderizarRuta({ sesion = null, perfilesPermitidos = ['Administrador'], ruta = '/admin' } = {}) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/login" element={<LoginSimulado />} />
                <Route path="/403" element={<AccesoDenegado sesion={sesion} />} />
                <Route path="/" element={<h1>Inicio de la tienda</h1>} />
                <Route element={<RutaProtegida sesion={sesion} perfilesPermitidos={perfilesPermitidos} />}>
                    <Route path="/admin" element={<h1>Panel administrativo</h1>} />
                    <Route path="/admin/usuarios" element={<h1>Gestión de usuarios</h1>} />
                </Route>
            </Routes>
        </MemoryRouter>
    )
}

describe('J3-06 - Rutas protegidas por rol y página 403', () => {
    it('redirige al login cuando no existe una sesión y conserva el destino', () => {
        renderizarRuta({ ruta: '/admin/usuarios' })
        expect(screen.getByText('Iniciar sesión: /admin/usuarios')).toBeInTheDocument()
    })

    it('envía al cliente autenticado a /403 sin mostrar la página protegida', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Cliente' }, perfilesPermitidos: ['Administrador', 'Vendedor'] })
        expect(screen.getByRole('heading', { name: '403' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Acceso denegado' })).toBeInTheDocument()
        expect(screen.queryByText('Panel administrativo')).not.toBeInTheDocument()
    })

    it('permite al administrador acceder a rutas exclusivas', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Administrador' }, ruta: '/admin/usuarios' })
        expect(screen.getByText('Gestión de usuarios')).toBeInTheDocument()
    })

    it('permite al vendedor acceder a una ruta compartida', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Vendedor' }, perfilesPermitidos: ['Administrador', 'Vendedor'] })
        expect(screen.getByText('Panel administrativo')).toBeInTheDocument()
    })

    it('envía al vendedor a /403 en rutas solo para el administrador', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Vendedor' }, ruta: '/admin/usuarios' })
        expect(screen.getByRole('heading', { name: '403' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Ir al panel' })).toHaveAttribute('href', '/admin')
    })

    it('deniega el acceso a un perfil desconocido', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Desconocido' } })
        expect(screen.getByRole('heading', { name: '403' })).toBeInTheDocument()
    })

    it('desde 403 permite volver al inicio de la tienda', () => {
        renderizarRuta({ sesion: { tipoUsuario: 'Cliente' } })
        expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
        expect(screen.queryByRole('link', { name: 'Ir al panel' })).not.toBeInTheDocument()
    })
})
