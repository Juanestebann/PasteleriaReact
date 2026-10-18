// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import FormularioContacto from './FormularioContacto'

afterEach(() => {
    cleanup()
})
describe('FormularioContacto', () => {
    it('muestra errores cuando los campos obligatorios están vacíos', () => {
        render(<FormularioContacto />)
        fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))
        expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
        expect(screen.getByText('El correo es obligatorio.')).toBeTruthy()
        expect(screen.getByText('El mensaje es obligatorio.')).toBeTruthy()
    })

    it('valida el dominio del correo y el largo del mensaje', () => {
        render(<FormularioContacto />)
        fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Juan' } })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'juan@otro.cl' } })
        fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'corto' } })
        fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))
        expect(screen.getByText(/Ingrese un correo @duoc.cl/)).toBeTruthy()
        expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy()
    })

    it('no confirma un envío real sin servidor', () => {
        render(<FormularioContacto />)
        fireEvent.change(screen.getByLabelText('Nombre completo'), { target: { value: 'Juan Núñez' } })
        fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'juan@gmail.com' } })
        fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: 'Consulta sobre productos' } })
        fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }))
        expect(screen.getByRole('status').textContent).toMatch(/todavía no está disponible/)
    })
})
