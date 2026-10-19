import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Registro from './Registro'

describe('S08 - Página Registro', () => {

    it('registra al cliente, avisa a App y muestra el mensaje de éxito', async () => {
        const usuario = userEvent.setup()
        // Mock: reemplaza la función de App que guarda al usuario
        const onRegistrar = vi.fn()

        render(
            <MemoryRouter>
                <Registro usuarios={[]} onRegistrar={onRegistrar} />
            </MemoryRouter>
        )

        await usuario.type(screen.getByLabelText('RUN'), '123456785')
        await usuario.type(screen.getByLabelText('Nombre'), 'José')
        await usuario.type(screen.getByLabelText('Apellidos'), 'Cardoza')
        await usuario.type(screen.getByLabelText('Correo electrónico'), 'jose@duoc.cl')
        await usuario.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')
        await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Concepción')
        await usuario.type(screen.getByLabelText('Dirección'), 'Av. Los Carrera 123')
        await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
        await usuario.type(screen.getByLabelText('Confirmar contraseña'), 'clave123')
        await usuario.click(screen.getByRole('button', { name: 'Crear cuenta' }))

        expect(onRegistrar).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'José', tipoUsuario: 'Cliente' }))
        expect(screen.getByRole('status')).toHaveTextContent('Usuario creado exitosamente.')
    })
})