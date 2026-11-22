import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import UsuariosAdmin from './UsuariosAdmin'
import { listarUsuarios, eliminarUsuario } from '../../servicios/usuarios'

// S3-10: la página pide la lista a la API. Se simula el servicio para no depender del backend.
vi.mock('../../servicios/usuarios', () => ({ listarUsuarios: vi.fn(), eliminarUsuario: vi.fn() }))

const usuarios = [
    { run: '111111111', nombre: 'Administrador', apellidos: 'Mil Sabores', correo: 'admin@gmail.com', tipoUsuario: 'Administrador' },
    { run: '123456785', nombre: 'José', apellidos: 'Cardoza', correo: 'jose@duoc.cl', tipoUsuario: 'Cliente' },
]

// La sesión es la del administrador (RUN 111111111)
function renderizarPagina() {
    render(
        <MemoryRouter>
            <UsuariosAdmin sesion={{ run: '111111111', tipoUsuario: 'Administrador' }} />
        </MemoryRouter>
    )
}

describe('S3-10 - Página UsuariosAdmin conectada a la API', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        vi.restoreAllMocks()
    })

    it('muestra "Cargando" y luego la tabla con los usuarios y el botón Nuevo usuario', async () => {
        listarUsuarios.mockResolvedValue(usuarios)
        renderizarPagina()

        expect(screen.getByText('Cargando usuarios…')).toBeInTheDocument()
        expect(await screen.findByText('Mostrando 2 usuario(s)')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: '+ Nuevo usuario' })).toHaveAttribute('href', '/admin/usuarios/nuevo')
    })

    it('las tarjetas de resumen cuentan los usuarios por rol', async () => {
        listarUsuarios.mockResolvedValue(usuarios)
        renderizarPagina()
        await screen.findByText('Mostrando 2 usuario(s)')

        // within: busca solo dentro de cada tarjeta
        const total = screen.getByRole('heading', { name: 'Total usuarios' }).closest('article')
        const clientes = screen.getByRole('heading', { name: 'Clientes' }).closest('article')
        const vendedores = screen.getByRole('heading', { name: 'Vendedores' }).closest('article')

        expect(within(total).getByText('2')).toBeInTheDocument()
        expect(within(clientes).getByText('1')).toBeInTheDocument()
        expect(within(vendedores).getByText('0')).toBeInTheDocument()
    })

    it('si la API falla muestra el error y Reintentar vuelve a pedir la lista', async () => {
        const usuario = userEvent.setup()
        listarUsuarios.mockRejectedValueOnce({ request: {} }).mockResolvedValueOnce(usuarios)
        renderizarPagina()

        expect(await screen.findByRole('alert')).toHaveTextContent('No hay conexión con el servidor')
        await usuario.click(screen.getByRole('button', { name: 'Reintentar' }))

        expect(await screen.findByText('Mostrando 2 usuario(s)')).toBeInTheDocument()
        expect(listarUsuarios).toHaveBeenCalledTimes(2)
    })

    it('elimina un usuario con confirmación y quita su fila', async () => {
        const usuario = userEvent.setup()
        listarUsuarios.mockResolvedValue(usuarios)
        eliminarUsuario.mockResolvedValue()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        renderizarPagina()
        await screen.findByText('Mostrando 2 usuario(s)')

        await usuario.click(screen.getByRole('button', { name: 'Eliminar a José Cardoza' }))

        expect(eliminarUsuario).toHaveBeenCalledWith('123456785')
        expect(await screen.findByText('Mostrando 1 usuario(s)')).toBeInTheDocument()
        expect(screen.getByRole('status')).toHaveTextContent('Se eliminó a José Cardoza.')
    })

    it('el administrador no ve el botón Eliminar en su propia fila', async () => {
        listarUsuarios.mockResolvedValue(usuarios)
        renderizarPagina()
        await screen.findByText('Mostrando 2 usuario(s)')

        expect(screen.queryByRole('button', { name: 'Eliminar a Administrador Mil Sabores' })).not.toBeInTheDocument()
    })

    it('si la API rechaza la eliminación (409) muestra el mensaje y no quita la fila', async () => {
        const usuario = userEvent.setup()
        listarUsuarios.mockResolvedValue(usuarios)
        eliminarUsuario.mockRejectedValue({
            response: { status: 409, data: { mensaje: 'No se puede completar la operación porque el registro tiene datos asociados.' } },
        })
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        renderizarPagina()
        await screen.findByText('Mostrando 2 usuario(s)')

        await usuario.click(screen.getByRole('button', { name: 'Eliminar a José Cardoza' }))

        expect(await screen.findByRole('alert')).toHaveTextContent('tiene datos asociados')
        expect(screen.getByText('Mostrando 2 usuario(s)')).toBeInTheDocument()
    })
})