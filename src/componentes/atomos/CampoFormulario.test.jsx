import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CampoFormulario from './CampoFormulario'

describe('S03 - CampoFormulario', () => {

    it('asocia la etiqueta con el campo', () => {
        render(<CampoFormulario id="nombre" etiqueta="Nombre" valor="" onChange={() => {}} />)

        // getByLabelText solo encuentra el campo si el label tiene el htmlFor correcto
        expect(screen.getByLabelText('Nombre')).toHaveAttribute('id', 'nombre')
    })

    it('muestra el error como alerta y marca el campo como inválido', () => {
        render(
            <CampoFormulario id="correo" etiqueta="Correo" valor="" onChange={() => {}} error="El correo es obligatorio." />
        )

        expect(screen.getByRole('alert')).toHaveTextContent('El correo es obligatorio.')
        expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
    })
})