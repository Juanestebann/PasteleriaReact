import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioUsuario from './FormularioUsuario'

// Llena el formulario de registro con datos válidos.
// Se puede cambiar cualquier campo pasando "cambios".
async function llenarRegistro(usuario, cambios = {}) {
    const datos = {
        run: '123456785',
        nombre: 'José',
        apellidos: 'Cardoza',
        correo: 'jose@duoc.cl',
        direccion: 'Av. Los Carrera 123',
        contrasena: 'clave123',
        confirmar: 'clave123',
        ...cambios,
    }
    await usuario.type(screen.getByLabelText('RUN'), datos.run)
    await usuario.type(screen.getByLabelText('Nombre'), datos.nombre)
    await usuario.type(screen.getByLabelText('Apellidos'), datos.apellidos)
    await usuario.type(screen.getByLabelText('Correo electrónico'), datos.correo)
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Concepción')
    await usuario.type(screen.getByLabelText('Dirección'), datos.direccion)
    await usuario.type(screen.getByLabelText('Contraseña'), datos.contrasena)
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), datos.confirmar)
}

describe('S07 - FormularioUsuario', () => {

    it('registra un cliente válido y lo entrega con tipo Cliente', async () => {
        const usuario = userEvent.setup()
        const onGuardar = vi.fn()

        render(<FormularioUsuario modo="registro" onGuardar={onGuardar} mensajeExito="Usuario creado exitosamente." />)
        await llenarRegistro(usuario)
        await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(onGuardar).toHaveBeenCalledTimes(1)
        expect(onGuardar.mock.calls[0][0]).toMatchObject({
            run: '123456785',
            correo: 'jose@duoc.cl',
            comuna: 'Concepción',
            tipoUsuario: 'Cliente',
        })
        // La confirmación de contraseña no se guarda
        expect(onGuardar.mock.calls[0][0]).not.toHaveProperty('confirmarContrasena')
        expect(screen.getByRole('status')).toHaveTextContent('Usuario creado exitosamente.')
    })

    it('no guarda si el RUN es inválido o las contraseñas no coinciden', async () => {
        const usuario = userEvent.setup()
        const onGuardar = vi.fn()

        render(<FormularioUsuario modo="registro" onGuardar={onGuardar} />)
        await llenarRegistro(usuario, { run: '123456789', confirmar: 'otraClave' })
        await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(onGuardar).not.toHaveBeenCalled()
        expect(screen.getByText('Ingrese un RUN válido, sin puntos ni guion.')).toBeInTheDocument()
        expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
    })

    it('avisa cuando el RUN ya está registrado', async () => {
        const usuario = userEvent.setup()
        const existentes = [{ run: '123456785', correo: 'otro@gmail.com' }]

        render(<FormularioUsuario modo="registro" usuariosExistentes={existentes} onGuardar={vi.fn()} />)
        await llenarRegistro(usuario)
        await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(screen.getByText('Este RUN ya se encuentra registrado.')).toBeInTheDocument()
    })

    it('en modo editar bloquea el RUN y no muestra campos de contraseña', () => {
        const usuarioExistente = {
            run: '111111111',
            nombre: 'Administrador',
            apellidos: 'Mil Sabores',
            correo: 'admin@gmail.com',
            region: 'Región del Biobío',
            comuna: 'Concepción',
            direccion: 'Av. San Martín 1234',
            tipoUsuario: 'Administrador',
        }

        render(<FormularioUsuario modo="editar" usuarioInicial={usuarioExistente} onGuardar={vi.fn()} textoBoton="Guardar cambios" />)

        expect(screen.getByLabelText('RUN')).toBeDisabled()
        expect(screen.getByLabelText('RUN')).toHaveValue('111111111')
        expect(screen.getByLabelText('Rol')).toHaveValue('Administrador')
        expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument()
    })
})