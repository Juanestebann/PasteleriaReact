import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import '@testing-library/jest-dom/vitest'
import OrdenesAdmin from './OrdenesAdmin'
import { listarBoletas } from '../../servicios/boletas'

vi.mock('../../servicios/boletas', () => ({ listarBoletas: vi.fn() }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('J3-09 listado de órdenes', () => {
    it('muestra las boletas devueltas por la API', async () => {
        listarBoletas.mockResolvedValue([{ id: 4, fecha: '2026-11-21T16:27:43', total: 40500, detalle: [{ cantidad: 1 }] }])
        render(<MemoryRouter><OrdenesAdmin /></MemoryRouter>)
        expect(await screen.findByText('#4')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Ver detalle' })).toHaveAttribute('href', '/admin/ordenes/4')
        expect(screen.getByText('$40.500')).toBeInTheDocument()
    })

    it('muestra un mensaje si no hay órdenes', async () => {
        listarBoletas.mockResolvedValue([])
        render(<MemoryRouter><OrdenesAdmin /></MemoryRouter>)
        expect(await screen.findByText('No hay órdenes registradas todavía.')).toBeInTheDocument()
    })

    it('muestra errores de red', async () => {
        listarBoletas.mockRejectedValue(new Error('Sin conexión'))
        render(<MemoryRouter><OrdenesAdmin /></MemoryRouter>)
        expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor')
    })
})
