import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/vitest'
import MisCompras from './MisCompras'
import { listarMisCompras } from '../../servicios/boletas'

vi.mock('../../servicios/boletas', () => ({ listarMisCompras: vi.fn() }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
const renderizar = () => render(<MemoryRouter><MisCompras /></MemoryRouter>)

describe('J3-10 - Mis compras', () => {
    it('muestra el historial devuelto por la API y el enlace al detalle', async () => {
        listarMisCompras.mockResolvedValue([{ id: 6, fecha: '2026-11-21T16:00:00', total: 40500, detalle: [{ cantidad: 2 }] }])
        renderizar()
        expect(await screen.findByText('Boleta #6')).toBeInTheDocument()
        expect(screen.getByText('$40.500')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '/mis-compras/6')
    })
    it('presenta el estado sin compras', async () => {
        listarMisCompras.mockResolvedValue([])
        renderizar()
        expect(await screen.findByText('Aún no tienes compras registradas.')).toBeInTheDocument()
    })
    it('permite reintentar después de un error', async () => {
        listarMisCompras.mockRejectedValueOnce(new Error('API apagada')).mockResolvedValueOnce([])
        renderizar()
        expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor')
        await userEvent.setup().click(screen.getByRole('button', { name: 'Reintentar' }))
        expect(await screen.findByText('Aún no tienes compras registradas.')).toBeInTheDocument()
        expect(listarMisCompras).toHaveBeenCalledTimes(2)
    })
})
