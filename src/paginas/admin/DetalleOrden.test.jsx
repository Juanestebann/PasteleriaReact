import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import '@testing-library/jest-dom/vitest'
import DetalleOrden from './DetalleOrden'
import { obtenerBoleta } from '../../servicios/boletas'

vi.mock('../../servicios/boletas', () => ({ obtenerBoleta: vi.fn() }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

const mostrar = () => render(<MemoryRouter initialEntries={['/admin/ordenes/4']}><Routes><Route path="/admin/ordenes/:id" element={<DetalleOrden />} /></Routes></MemoryRouter>)

describe('J3-09 detalle de orden', () => {
    it('muestra líneas y montos registrados por el backend', async () => {
        obtenerBoleta.mockResolvedValue({ id: 4, fecha: '2026-11-21T16:27:43', subtotal: 45000, descuento: 4500, total: 40500, detalle: [{ codigo: 'TC001', nombre: 'Torta de Chocolate', cantidad: 1, precioUnitario: 45000, subtotal: 45000 }] })
        mostrar()
        expect(await screen.findByText('Torta de Chocolate')).toBeInTheDocument()
        expect(obtenerBoleta).toHaveBeenCalledWith('4')
        expect(screen.getByText('$40.500')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/admin/ordenes')
    })

    it('informa cuando la boleta no existe', async () => {
        obtenerBoleta.mockRejectedValue({ response: { status: 404 } })
        mostrar()
        expect(await screen.findByRole('alert')).toHaveTextContent('No se encontró la orden')
    })
})
