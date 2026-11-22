import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import VerUsuario from './VerUsuario'
import { obtenerUsuario } from '../../servicios/usuarios'

// S3-10: el detalle se pide a la API. Se simula el servicio para no depender del backend.
vi.mock('../../servicios/usuarios', () => ({ obtenerUsuario: vi.fn() }))

const jose = {
    run: '123456785',
    nombre: 'José',
    apellidos: 'Cardoza',
    correo: 'jose@duoc.cl',
    fechaNacimiento: '2004-03-15',
    region: 'Región del Biobío',
    comuna: 'Concepción',
    direccion: 'Av. Los Carrera 123',
    tipoUsuario: 'Cliente',
}

// Se dibuja con la misma ruta de App, para que useParams reciba el :run de la URL
function renderizarDetalle(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/usuarios/:run" element={<VerUsuario />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('S3-10 - Página VerUsuario conectada a la API', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('pide el usuario del RUN de la URL y muestra sus datos', async () => {
        obtenerUsuario.mockResolvedValue(jose)
        renderizarDetalle('/admin/usuarios/123456785')

        expect(await screen.findByRole('heading', { name: 'José Cardoza' })).toBeInTheDocument()
        expect(obtenerUsuario).toHaveBeenCalledWith('123456785')
        expect(screen.getByText('12.345.678-5')).toBeInTheDocument()
        expect(screen.getByText('15-03-2004')).toBeInTheDocument()
        expect(screen.getByText('Av. Los Carrera 123')).toBeInTheDocument()
    })

    it('el botón Editar usuario lleva a la edición de ese RUN', async () => {
        obtenerUsuario.mockResolvedValue(jose)
        renderizarDetalle('/admin/usuarios/123456785')

        expect(await screen.findByRole('link', { name: /Editar usuario/ })).toHaveAttribute(
            'href',
            '/admin/usuarios/123456785/editar'
        )
    })

    it('si la API responde 404 muestra "Usuario no encontrado"', async () => {
        obtenerUsuario.mockRejectedValue({ response: { status: 404, data: { mensaje: 'Usuario no encontrado.' } } })
        renderizarDetalle('/admin/usuarios/999999999')

        expect(await screen.findByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Editar usuario/ })).not.toBeInTheDocument()
    })
})