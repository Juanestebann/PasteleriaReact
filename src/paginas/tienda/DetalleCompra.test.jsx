import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import '@testing-library/jest-dom/vitest'
import DetalleCompra from './DetalleCompra'
import { obtenerBoleta } from '../../servicios/boletas'

vi.mock('../../servicios/boletas', () => ({ obtenerBoleta: vi.fn() }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
const renderizar = () => render(<MemoryRouter initialEntries={['/mis-compras/6']}><Routes><Route path="/mis-compras/:id" element={<DetalleCompra />} /></Routes></MemoryRouter>)

describe('J3-10 - Detalle de compra', () => {
    it('muestra líneas, descuentos y total de la boleta', async () => {
        obtenerBoleta.mockResolvedValue({ id: 6, fecha: '2026-11-21T16:00:00', subtotal: 45000, descuento: 4500, total: 40500,
            detalle: [{ codigo: 'TC001', nombre: 'Torta de chocolate', cantidad: 1, precioUnitario: 45000, subtotal: 45000 }] })
        renderizar()
        expect(await screen.findByText('Torta de chocolate')).toBeInTheDocument()
        expect(obtenerBoleta).toHaveBeenCalledWith('6')
        expect(screen.getByText('$40.500')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Volver a mis compras' })).toHaveAttribute('href', '/mis-compras')
    })
    it('muestra un 403 sin revelar el detalle de otra compra', async () => {
        obtenerBoleta.mockRejectedValue({ response: { status: 403, data: { mensaje: 'Prohibido' } } })
        renderizar()
        expect(await screen.findByRole('alert')).toHaveTextContent('No tienes permiso')
        expect(screen.queryByText('Torta de chocolate')).not.toBeInTheDocument()
    })
})
