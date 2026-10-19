import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectorRegionComuna from './SelectorRegionComuna'

describe('S04 - SelectorRegionComuna', () => {

    it('muestra solo las comunas de la región seleccionada', () => {
        render(<SelectorRegionComuna region="Región de Ñuble" comuna="" onCambiar={() => {}} />)

        const selectComuna = screen.getByLabelText('Comuna')
        expect(within(selectComuna).getByRole('option', { name: 'Chillán' })).toBeInTheDocument()
        expect(within(selectComuna).queryByRole('option', { name: 'Concepción' })).not.toBeInTheDocument()
    })

    it('al cambiar la región avisa el cambio y limpia la comuna', async () => {
        const usuario = userEvent.setup()
        // Mock: función falsa que anota con qué datos la llaman
        const onCambiar = vi.fn()

        render(<SelectorRegionComuna region="" comuna="" onCambiar={onCambiar} />)
        await usuario.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')

        expect(onCambiar).toHaveBeenCalledWith('region', 'Región del Biobío')
        expect(onCambiar).toHaveBeenCalledWith('comuna', '')
    })
})