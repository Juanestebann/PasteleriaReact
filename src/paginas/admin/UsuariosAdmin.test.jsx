import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import UsuariosAdmin from './UsuariosAdmin'

const usuarios = [
    { run: '111111111', nombre: 'Administrador', apellidos: 'Mil Sabores', correo: 'admin@gmail.com', tipoUsuario: 'Administrador' },
    { run: '123456785', nombre: 'José', apellidos: 'Cardoza', correo: 'jose@duoc.cl', tipoUsuario: 'Cliente' },
]

// La página usa Link, por eso se dibuja dentro de un router de prueba
function renderizarPagina() {
    render(
        <MemoryRouter>
            <UsuariosAdmin usuarios={usuarios} />
        </MemoryRouter>
    )
}

describe('S10 - Página UsuariosAdmin', () => {

    it('muestra el título, la tabla con los usuarios y el botón Nuevo usuario', () => {
        renderizarPagina()

        expect(screen.getByRole('heading', { name: 'Gestión de usuarios' })).toBeInTheDocument()
        expect(screen.getByText('Mostrando 2 usuario(s)')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: '+ Nuevo usuario' })).toHaveAttribute('href', '/admin/usuarios/nuevo')
    })

    it('las tarjetas de resumen cuentan los usuarios por rol', () => {
        renderizarPagina()

        // within: busca solo dentro de cada tarjeta
        const total = screen.getByRole('heading', { name: 'Total usuarios' }).closest('article')
        const clientes = screen.getByRole('heading', { name: 'Clientes' }).closest('article')
        const vendedores = screen.getByRole('heading', { name: 'Vendedores' }).closest('article')

        expect(within(total).getByText('2')).toBeInTheDocument()
        expect(within(clientes).getByText('1')).toBeInTheDocument()
        expect(within(vendedores).getByText('0')).toBeInTheDocument()
    })
})