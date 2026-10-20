import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import EditorUsuario from './EditorUsuario'

const usuarios = [
    {
        run: '123456785',
        nombre: 'José',
        apellidos: 'Cardoza',
        correo: 'jose@duoc.cl',
        fechaNacimiento: '',
        region: 'Región del Biobío',
        comuna: 'Concepción',
        direccion: 'Av. Los Carrera 123',
        contrasena: 'clave123',
        tipoUsuario: 'Cliente',
    },
]

// Se dibuja con las mismas rutas de App, para que useParams reciba el :run de la URL
function renderizarEditor(ruta, props = {}) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
                <Route path="/admin/usuarios/nuevo" element={<EditorUsuario usuarios={usuarios} {...props} />} />
                <Route path="/admin/usuarios/:run/editar" element={<EditorUsuario usuarios={usuarios} {...props} />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('S11 - Página EditorUsuario', () => {

    it('en modo nuevo crea el usuario con el rol elegido y muestra el mensaje', async () => {
        const usuario = userEvent.setup()
        const onCrear = vi.fn()
        renderizarEditor('/admin/usuarios/nuevo', { onCrear })

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

        expect(onCrear).toHaveBeenCalledWith(expect.objectContaining({ run: '100000059', tipoUsuario: 'Vendedor' }))
        expect(screen.getByRole('status')).toHaveTextContent('Usuario creado correctamente.')
    })

    it('en modo editar carga los datos del RUN de la URL y bloquea el RUN', () => {
        renderizarEditor('/admin/usuarios/123456785/editar')

        expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument()
        expect(screen.getByLabelText('Nombre')).toHaveValue('José')
        expect(screen.getByLabelText('RUN')).toBeDisabled()
    })

    it('al guardar cambios avisa a App con el usuario editado', async () => {
        const usuario = userEvent.setup()
        const onActualizar = vi.fn()
        renderizarEditor('/admin/usuarios/123456785/editar', { onActualizar })

        await usuario.clear(screen.getByLabelText('Nombre'))
        await usuario.type(screen.getByLabelText('Nombre'), 'José Ignacio')
        await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }))

        // Se mantiene el RUN y la contraseña; solo cambia el nombre
        expect(onActualizar).toHaveBeenCalledWith(
            expect.objectContaining({ run: '123456785', nombre: 'José Ignacio', contrasena: 'clave123' })
        )
        expect(screen.getByRole('status')).toHaveTextContent('Usuario actualizado correctamente.')
    })

    it('si el RUN no existe muestra "Usuario no encontrado"', () => {
        renderizarEditor('/admin/usuarios/999999999/editar')

        expect(screen.getByRole('heading', { name: 'Usuario no encontrado' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Guardar cambios' })).not.toBeInTheDocument()
    })

    it('el botón Cancelar vuelve al listado', async () => {
        const usuario = userEvent.setup()
        renderizarEditor('/admin/usuarios/nuevo')

        await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(screen.getByText('Listado de usuarios')).toBeInTheDocument()
    })
})