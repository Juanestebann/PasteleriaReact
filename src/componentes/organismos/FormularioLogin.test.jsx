import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioLogin from './FormularioLogin'

describe('S05 - FormularioLogin', () => {

    it('muestra dos errores al enviar el formulario vacío y no intenta iniciar sesión', async () => {
        const usuario = userEvent.setup()
        const onIniciarSesion = vi.fn()

        render(<FormularioLogin onIniciarSesion={onIniciarSesion} />)
        await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

        expect(screen.getAllByRole('alert')).toHaveLength(2)
        expect(onIniciarSesion).not.toHaveBeenCalled()
    })

    it('rechaza un correo con dominio no permitido', async () => {
        const usuario = userEvent.setup()
        render(<FormularioLogin onIniciarSesion={vi.fn()} />)

        await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@hotmail.com')
        await usuario.type(screen.getByLabelText('Contraseña'), 'clave123')
        await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

        expect(screen.getByText('Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.')).toBeInTheDocument()
    })

    it('rechaza una contraseña de menos de 4 caracteres', async () => {
        const usuario = userEvent.setup()
        render(<FormularioLogin onIniciarSesion={vi.fn()} />)

        await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@gmail.com')
        await usuario.type(screen.getByLabelText('Contraseña'), '123')
        await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

        expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeInTheDocument()
    })

    it('con datos válidos avisa hacia arriba con el correo en minúsculas', async () => {
        const usuario = userEvent.setup()
        // El mock simula que las credenciales son correctas
        const onIniciarSesion = vi.fn().mockReturnValue(true)

        render(<FormularioLogin onIniciarSesion={onIniciarSesion} />)
        await usuario.type(screen.getByLabelText('Correo electrónico'), 'ADMIN@gmail.com')
        await usuario.type(screen.getByLabelText('Contraseña'), 'admin123')
        await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

        expect(onIniciarSesion).toHaveBeenCalledWith({ correo: 'admin@gmail.com', contrasena: 'admin123' })
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('muestra un mensaje cuando las credenciales no son correctas', async () => {
        const usuario = userEvent.setup()
        // El mock simula credenciales incorrectas
        const onIniciarSesion = vi.fn().mockReturnValue(false)

        render(<FormularioLogin onIniciarSesion={onIniciarSesion} />)
        await usuario.type(screen.getByLabelText('Correo electrónico'), 'admin@gmail.com')
        await usuario.type(screen.getByLabelText('Contraseña'), 'equivocada')
        await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

        expect(screen.getByRole('alert')).toHaveTextContent('El email o la contraseña no son correctos.')
    })
})