import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Registro from './Registro'
import { registrar } from '../../servicios/auth'

// S3-09: el registro ahora llama a la API. Se simula el servicio para no depender del backend.
vi.mock('../../servicios/auth', () => ({ registrar: vi.fn() }))

// Llena el formulario con datos válidos y presiona "Crear cuenta"
async function llenarYEnviar(usuario) {
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
}

function renderizarRegistro(onRegistrar = vi.fn()) {
    render(
        <MemoryRouter>
            <Registro onRegistrar={onRegistrar} />
        </MemoryRouter>
    )
}

describe('S3-09 - Página Registro conectada a la API', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('crea la cuenta en la API, entrega la respuesta a App y muestra el éxito', async () => {
        const usuario = userEvent.setup()
        const onRegistrar = vi.fn()
        const respuesta = { accessToken: 'token', refreshToken: 'refresh', usuario: { nombre: 'José', rol: 'CLIENTE' } }
        registrar.mockResolvedValue(respuesta)

        renderizarRegistro(onRegistrar)
        await llenarYEnviar(usuario)

        expect(await screen.findByText('Usuario creado exitosamente.')).toBeInTheDocument()
        expect(registrar).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'José', correo: 'jose@duoc.cl' }))
        expect(onRegistrar).toHaveBeenCalledWith(respuesta)
    })

    it('con un 409 muestra el mensaje de la API y no inicia sesión', async () => {
        const usuario = userEvent.setup()
        const onRegistrar = vi.fn()
        registrar.mockRejectedValue({ response: { status: 409, data: { mensaje: 'El RUN ya está registrado.', campos: {} } } })

        renderizarRegistro(onRegistrar)
        await llenarYEnviar(usuario)

        expect(await screen.findByText('El RUN ya está registrado.')).toBeInTheDocument()
        expect(onRegistrar).not.toHaveBeenCalled()
    })

    it('con un 400 muestra el error de la API bajo el campo correspondiente', async () => {
        const usuario = userEvent.setup()
        registrar.mockRejectedValue({
            response: { status: 400, data: { mensaje: 'Revisa los datos marcados', campos: { direccion: 'La dirección no es válida.' } } },
        })

        renderizarRegistro()
        await llenarYEnviar(usuario)

        expect(await screen.findByText('La dirección no es válida.')).toBeInTheDocument()
    })
})