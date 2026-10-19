import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import TablaUsuarios from './TablaUsuarios'

// Usuarios de ejemplo para las pruebas
const usuarios = [
    { run: '111111111', nombre: 'Administrador', apellidos: 'Mil Sabores', correo: 'admin@gmail.com', tipoUsuario: 'Administrador' },
    { run: '222222222', nombre: 'Vendedor', apellidos: 'Mil Sabores', correo: 'vendedor@gmail.com', tipoUsuario: 'Vendedor' },
    { run: '123456785', nombre: 'José', apellidos: 'Cardoza', correo: 'jose@duoc.cl', tipoUsuario: 'Cliente' },
]

// La tabla usa Link, por eso se dibuja dentro de un router de prueba
function renderizarTabla(lista = usuarios) {
    render(
        <MemoryRouter>
            <TablaUsuarios usuarios={lista} />
        </MemoryRouter>
    )
}

describe('S09 - TablaUsuarios', () => {

    it('muestra una fila por usuario y el contador', () => {
        renderizarTabla()

        // 1 fila de encabezado + 3 usuarios
        expect(screen.getAllByRole('row')).toHaveLength(4)
        expect(screen.getByText('Mostrando 3 usuario(s)')).toBeInTheDocument()
    })

    it('filtra por rol', async () => {
        const usuario = userEvent.setup()
        renderizarTabla()

        await usuario.selectOptions(screen.getByLabelText('Filtrar por rol:'), 'Cliente')

        expect(screen.getByText('Mostrando 1 usuario(s)')).toBeInTheDocument()
        expect(screen.getByText('jose@duoc.cl')).toBeInTheDocument()
        expect(screen.queryByText('admin@gmail.com')).not.toBeInTheDocument()
    })

    it('busca por RUN o correo', async () => {
        const usuario = userEvent.setup()
        renderizarTabla()

        await usuario.type(screen.getByLabelText('Buscar usuario'), 'vendedor@')

        expect(screen.getByText('Mostrando 1 usuario(s)')).toBeInTheDocument()
        expect(screen.getByText('222222222')).toBeInTheDocument()
    })

    it('los botones Ver y Editar llevan a la página del usuario por su RUN', () => {
        renderizarTabla([usuarios[2]])

        expect(screen.getByRole('link', { name: /Ver/ })).toHaveAttribute('href', '/admin/usuarios/123456785')
        expect(screen.getByRole('link', { name: /Editar/ })).toHaveAttribute('href', '/admin/usuarios/123456785/editar')
    })

    it('muestra un mensaje cuando no hay usuarios', () => {
        renderizarTabla([])

        expect(screen.getByText('No existen usuarios registrados.')).toBeInTheDocument()
    })
})