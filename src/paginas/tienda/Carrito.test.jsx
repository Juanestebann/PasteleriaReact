
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Carrito from './Carrito'
import { crearBoleta } from '../../servicios/boletas'

vi.mock('../../servicios/boletas', () => ({ crearBoleta: vi.fn() }))
const sesionCliente = { rol: 'CLIENTE', tipoUsuario: 'Cliente' }
function prepararSesion() {
    localStorage.setItem('sesion', JSON.stringify({ accessToken: 'token-prueba' }))
}

const productoPrueba = {
    codigo: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    descripcion: 'Torta de chocolate con ganache',
    precio: 45000,
    imagen: '/img/Torta Cuadrada de Chocolate.png',
    cantidad: 2
}

function renderizarCarrito(productos, sesion = sesionCliente) {
    return render(
        <MemoryRouter>
            <Carrito productos={productos} sesion={sesion} />
        </MemoryRouter>
    )
}

function prepararCarrito(productos = [productoPrueba]) {
    localStorage.setItem('carrito', JSON.stringify(productos))
}

describe('C07 - Página del carrito', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('muestra el mensaje cuando el carrito está vacío', () => {
        renderizarCarrito()

        expect(
            screen.getByText('Tu carrito está vacío.')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ver productos' })
        ).toHaveAttribute('href', '/productos')
    })

    it('muestra el producto y su subtotal', () => {
        prepararCarrito()
        renderizarCarrito()

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument()

        expect(screen.getAllByText('$90.000')).toHaveLength(3)
    })

    it('aumenta la cantidad y actualiza el total', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.click(
            screen.getByRole('button', {
                name: /Aumentar cantidad/
            })
        )

        expect(screen.getAllByText('$135.000')).toHaveLength(3)
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('disminuye la cantidad y actualiza el total', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.click(
            screen.getByRole('button', {
                name: /Disminuir cantidad/
            })
        )

        expect(screen.getAllByText('$45.000')).toHaveLength(3)
        expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('elimina el producto del carrito', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.click(
            screen.getByRole('button', {
                name: /Eliminar.*del carrito/
            })
        )

        expect(
            screen.getByText('Tu carrito está vacío.')
        ).toBeInTheDocument()
    })

    it('permite vaciar el carrito completo', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Vaciar carrito'
            })
        )

        expect(
            screen.getByText('Tu carrito está vacío.')
        ).toBeInTheDocument()
    })

    it('registra la boleta y solo después vacía el carrito', async () => {
        prepararCarrito()
        prepararSesion()
        let confirmar
        crearBoleta.mockReturnValue(new Promise(resolve => { confirmar = resolve }))
        renderizarCarrito()

        fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }))
        expect(crearBoleta).toHaveBeenCalledWith([productoPrueba], '')
        expect(screen.getByRole('button', { name: 'Procesando compra...' })).toBeDisabled()
        expect(JSON.parse(localStorage.getItem('carrito'))).toHaveLength(1)

        confirmar({ id: 17, total: 90000 })
        expect(await screen.findByText(/Boleta N.º 17/)).toBeInTheDocument()
        expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
        expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([])
    })

    it('mantiene el carrito y muestra el error cuando falla la API', async () => {
        prepararCarrito()
        prepararSesion()
        crearBoleta.mockRejectedValue({ response: { status: 409, data: { mensaje: 'Sin stock disponible' } } })
        renderizarCarrito()

        fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }))
        expect(await screen.findByRole('alert')).toHaveTextContent('Sin stock disponible')
        expect(JSON.parse(localStorage.getItem('carrito'))).toHaveLength(1)
        expect(screen.getByRole('button', { name: 'PAGAR' })).toBeEnabled()
    })

    it('bloquea el pago para administrador sin enviar solicitud', () => {
        prepararCarrito()
        prepararSesion()
        renderizarCarrito(undefined, { rol: 'ADMINISTRADOR' })
        fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }))
        expect(screen.getByRole('alert')).toHaveTextContent('Solo una cuenta de cliente')
        expect(crearBoleta).not.toHaveBeenCalled()
    })

    it('envía el cupón validado al confirmar la compra', async () => {
        prepararCarrito()
        prepararSesion()
        crearBoleta.mockResolvedValue({ id: 18, total: 81000 })
        renderizarCarrito()
        fireEvent.change(screen.getByLabelText('Código de descuento'), { target: { value: 'FELICES10' } })
        fireEvent.click(screen.getByRole('button', { name: 'Aplicar cupón' }))
        fireEvent.click(screen.getByRole('button', { name: 'PAGAR' }))
        expect(crearBoleta).toHaveBeenCalledWith([productoPrueba], 'felices10')
        expect(await screen.findByText(/Boleta N.º 18/)).toBeInTheDocument()
    })

    it('aplica el descuento felices10', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.change(
            screen.getByLabelText('Código de descuento'),
            { target: { value: 'felices10' } }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Aplicar cupón'
            })
        )

        expect(
            screen.getByText('Cupón aplicado correctamente.')
        ).toBeInTheDocument()

        expect(screen.getByText('-$9.000')).toBeInTheDocument()

        const resumen = screen.getByText('Resumen de compra')
            .closest('section')

        expect(
            within(resumen).getByText('$81.000')
        ).toBeInTheDocument()
    })

    it('no aplica descuentos con un cupón inválido', () => {
        prepararCarrito()
        renderizarCarrito()

        fireEvent.change(
            screen.getByLabelText('Código de descuento'),
            { target: { value: 'incorrecto' } }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Aplicar cupón'
            })
        )

        expect(
            screen.queryByText('Cupón aplicado correctamente.')
        ).not.toBeInTheDocument()

        expect(screen.getAllByText('$90.000')).toHaveLength(3)
    })

    it('recupera productos guardados en localStorage', () => {
        prepararCarrito()
        renderizarCarrito()

        expect(
            screen.getByText('Torta Cuadrada de Chocolate')
        ).toBeInTheDocument()
    })

    // C11 - Pruebas de regresión de stock y precios

    it('respeta el stock actualizado del inventario', () => {
        prepararCarrito()

        const productosActualizados = [
            {
                codigo: 'TC001',
                precio: 45000,
                stock: 2
            }
        ]

        renderizarCarrito(productosActualizados)

        fireEvent.click(
            screen.getByRole('button', {
                name: /Aumentar cantidad/
            })
        )

        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getAllByText('$90.000')).toHaveLength(3)
    })

    it('actualiza el precio y recalcula el descuento del carrito', () => {
        prepararCarrito()

        const productosActualizados = [
            {
                codigo: 'TC001',
                nombre: 'Torta Cuadrada de Chocolate',
                precio: 48000,
                stock: 10
            }
        ]

        renderizarCarrito(productosActualizados)

        const resumen = screen.getByText('Resumen de compra')
            .closest('section')

        // Subtotal y total son iguales antes de aplicar el cupón.
        expect(
            within(resumen).getAllByText('$96.000')
        ).toHaveLength(2)

        fireEvent.change(
            screen.getByLabelText('Código de descuento'),
            { target: { value: 'felices10' } }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Aplicar cupón'
            })
        )

        expect(
            screen.getByText('-$9.600')
        ).toBeInTheDocument()

        expect(
            within(resumen).getByText('$86.400')
        ).toBeInTheDocument()
    })
})
