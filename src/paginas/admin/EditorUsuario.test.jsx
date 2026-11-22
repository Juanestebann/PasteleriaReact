import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import EditorUsuario from './EditorUsuario'
import { obtenerUsuario, crearUsuario, actualizarUsuario } from '../../servicios/usuarios'

// S3-10: crear y editar se hacen en la API. Se simula el servicio para no depender del backend.
vi.mock('../../servicios/usuarios', () => ({
    obtenerUsuario: vi.fn(),
    crearUsuario: vi.fn(),
    actualizarUsuario: vi.fn(),
}))

const jose = {
    run: '123456785',
    nombre: 'José',
    apellidos: 'Cardoza',
    correo: 'jose@duoc.cl',
    fechaNacimiento: '',
    region: 'Región del Biobío',
    comuna: 'Concepción',
    direccion: 'Av. Los Carrera 123',
    tipoUsuario: 'Cliente',
    rol: 'CLIENTE',
}

// Se dibuja con las mismas rutas de App, para que useParams reciba el :run de la URL
function renderizarEditor(ruta) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
                <Route path="/admin/usuarios/nuevo" element={<EditorUsuario />} />
                <Route path="/admin/usuarios/:run/editar" element={<EditorUsuario />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('S3-10 - Página EditorUsuario conectada a la API', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('en modo nuevo crea el usuario en la API con el rol elegido y muestra el mensaje', async () => {
        const usuario = userEvent.setup()
        crearUsuario.mockResolvedValue({ ...jose, run: '100000059', tipoUsuario: 'Vendedor' })
        renderizarEditor('/admin/usuarios/nuevo')

        expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()

        await usuario.type(screen.getByLabelText('RUN'), '100000059')
        await usuario.selectOptions(screen.getByLabelText('Rol'), 'Vendedor')
        await usuario.type(screen.getByLabelText('Nombre'), 'Catalina')
        await usuario.type(screen.getByLabelText('Apellidos'), 'Díaz')
        await usuario.type(screen.getByLabelText('Correo electrónico'), 'cata@duoc.cl')
        await usuario.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')
        await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Concepción')
        await usuario.type(screen.getByLabelText('Dirección'), 'Calle Falsa 123')
        await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
        await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
        await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

        expect(await screen.findByText('Usuario creado correctamente.')).toBeInTheDocument()
        expect(crearUsuario).toHaveBeenCalledWith(expect.objectContaining({ run: '100000059', tipoUsuario: 'Vendedor' }))
    })

    it('en modo nuevo muestra el 409 de la API (RUN repetido)', async () => {
        const usuario = userEvent.setup()
        crearUsuario.mockRejectedValue({ response: { status: 409, data: { mensaje: 'El RUN ya está registrado.' } } })
        renderizarEditor('/admin/usuarios/nuevo')

        await usuario.type(screen.getByLabelText('RUN'), '100000059')
        await usuario.selectOptions(screen.getByLabelText('Rol'), 'Vendedor')
        await usuario.type(screen.getByLabelText('Nombre'), 'Catalina')
        await usuario.type(screen.getByLabelText('Apellidos'), 'Díaz')
        await usuario.type(screen.getByLabelText('Correo electrónico'), 'cata@duoc.cl')
        await usuario.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')
        await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Concepción')
        await usuario.type(screen.getByLabelText('Dirección'), 'Calle Falsa 123')
        await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
        await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
        await usuario.click(screen.getByRole('button', { name: 'Crear usuario' }))

        expect(await screen.findByRole('alert')).toHaveTextContent('El RUN ya está registrado.')
    })

    it('en modo editar carga el usuario desde la API y bloquea el RUN', async () => {
        obtenerUsuario.mockResolvedValue(jose)
        renderizarEditor('/admin/usuarios/123456785/editar')

        expect(screen.getByText('Cargando usuario…')).toBeInTheDocument()
        expect(await screen.findByLabelText('Nombre')).toHaveValue('José')
        expect(obtenerUsuario).toHaveBeenCalledWith('123456785')
        expect(screen.getByLabelText('RUN')).toBeDisabled()
    })

    it('al guardar cambios hace el PUT con el RUN de la URL', async () => {
        const usuario = userEvent.setup()
        obtenerUsuario.mockResolvedValue(jose)
        actualizarUsuario.mockResolvedValue({ ...jose, nombre: 'José Ignacio' })
        renderizarEditor('/admin/usuarios/123456785/editar')

        const campoNombre = await screen.findByLabelText('Nombre')
        await usuario.clear(campoNombre)
        await usuario.type(campoNombre, 'José Ignacio')
        await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

        expect(await screen.findByText('Usuario actualizado correctamente.')).toBeInTheDocument()
        expect(actualizarUsuario).toHaveBeenCalledWith(
            '123456785',
            expect.objectContaining({ run: '123456785', nombre: 'José Ignacio' })
        )
    })

    it('si la API responde 404 muestra "Usuario no encontrado"', async () => {
        obtenerUsuario.mockRejectedValue({ response: { status: 404, data: { mensaje: 'Usuario no encontrado.' } } })
        renderizarEditor('/admin/usuarios/999999999/editar')

        expect(await screen.findByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Guardar cambios' })).not.toBeInTheDocument()
    })

    it('el botón Cancelar vuelve al listado', async () => {
        const usuario = userEvent.setup()
        renderizarEditor('/admin/usuarios/nuevo')

        await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(screen.getByText('Listado de usuarios')).toBeInTheDocument()
    })
})