import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import VerUsuario from './VerUsuario'

const usuarios = [
    {
        run: '123456785',
        nombre: 'José',
        apellidos: 'Cardoza',
        correo: 'jose@duoc.cl',
        fechaNacimiento: '2004-03-15',
        region: 'Región del Biobío',
        comuna: 'Concepción',
        direccion: 'Av. Los Carrera 123',
        tipoUsuario: 'Cliente',
    },
]

// Se dibuja con la misma ruta de App, para que useParams reciba el :run de la URL
function renderizarDetalle(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/usuarios/:run" element={<VerUsuario usuarios={usuarios} />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('S12 - Página VerUsuario', () => {

    it('muestra los datos del usuario del RUN de la URL', () => {
        renderizarDetalle('/admin/usuarios/123456785')

        expect(screen.getByRole('heading', { name: 'José Cardoza' })).toBeInTheDocument()
        expect(screen.getByText('12.345.678-5')).toBeInTheDocument()
        expect(screen.getByText('jose@duoc.cl')).toBeInTheDocument()
        expect(screen.getByText('15-03-2004')).toBeInTheDocument()
        expect(screen.getByText('Av. Los Carrera 123')).toBeInTheDocument()
    })

    it('el botón Editar usuario lleva a la edición de ese RUN', () => {
        renderizarDetalle('/admin/usuarios/123456785')

        expect(screen.getByRole('link', { name: /Editar usuario/ })).toHaveAttribute(
            'href',
            '/admin/usuarios/123456785/editar'
        )
    })

    it('si el RUN no existe muestra "Usuario no encontrado"', () => {
        renderizarDetalle('/admin/usuarios/999999999')

        expect(screen.getByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Editar usuario/ })).not.toBeInTheDocument()
    })
})