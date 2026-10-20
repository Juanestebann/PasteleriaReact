
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import FormularioProducto, {
    validarProducto,
} from './FormularioProducto'

const productoValido = {
    codigo: 'TC099',
    nombre: 'Torta de prueba',
    precio: 15000,
    imagen: '/img/torta-prueba.png',
    descripcion: 'Torta utilizada en las pruebas.',
    categoria: 'cuadradas',
    stock: 10,
    stockCritico: 3,
}

describe('C09 - FormularioProducto', () => {
    it('muestra los campos necesarios para crear un producto', () => {
        render(
            <FormularioProducto
                onGuardar={vi.fn()}
                onCancelar={vi.fn()}
            />
        )

        expect(screen.getByLabelText('Código')).toBeTruthy()
        expect(screen.getByLabelText('Nombre')).toBeTruthy()
        expect(screen.getByLabelText('Precio')).toBeTruthy()
        expect(screen.getByLabelText('Stock')).toBeTruthy()
        expect(screen.getByLabelText('Stock crítico')).toBeTruthy()
        expect(screen.getByRole('button', {
            name: 'Crear producto',
        })).toBeTruthy()
    })

    it('rechaza precios negativos y stock decimal', () => {
        const errores = validarProducto({
            ...productoValido,
            precio: -500,
            stock: 2.5,
        })

        expect(errores.precio).toBeDefined()
        expect(errores.stock).toBeDefined()
    })

    it('rechaza códigos duplicados al crear productos', () => {
        const errores = validarProducto(productoValido, {
            modo: 'nuevo',
            productosExistentes: [productoValido],
        })

        expect(errores.codigo).toBeDefined()
    })

    it('en edición carga el producto y bloquea el código', () => {
        render(
            <FormularioProducto
                modo="editar"
                productoInicial={productoValido}
                onGuardar={vi.fn()}
                onCancelar={vi.fn()}
            />
        )

        expect(screen.getByLabelText('Código').disabled).toBe(true)
        expect(screen.getByLabelText('Nombre').value)
            .toBe('Torta de prueba')
        expect(screen.getByRole('button', {
            name: 'Guardar cambios',
        })).toBeTruthy()
    })

    it('no permite enviar un formulario vacío', () => {
        const onGuardar = vi.fn()

        render(
            <FormularioProducto
                onGuardar={onGuardar}
                onCancelar={vi.fn()}
            />
        )

        fireEvent.click(screen.getByRole('button', {
            name: 'Crear producto',
        }))

        expect(onGuardar).not.toHaveBeenCalled()
        expect(screen.getAllByRole('alert').length)
            .toBeGreaterThan(0)
    })

    it('entrega un producto válido con valores numéricos', () => {
        const onGuardar = vi.fn()

        render(
            <FormularioProducto
                modo="editar"
                productoInicial={productoValido}
                onGuardar={onGuardar}
                onCancelar={vi.fn()}
            />
        )

        fireEvent.click(screen.getByRole('button', {
            name: 'Guardar cambios',
        }))

        expect(onGuardar).toHaveBeenCalledWith(productoValido)
    })

    // ===== Pruebas adicionales de validación =====

    it('rechaza un precio vacío', () => {
        const errores = validarProducto({
            ...productoValido,
            precio: '',
        })

        expect(errores.precio).toBeDefined()
    })

    it('rechaza un precio que no es numérico', () => {
        const errores = validarProducto({
            ...productoValido,
            precio: 'abc',
        })

        expect(errores.precio).toBeDefined()
    })

    it('rechaza stock negativo y stock crítico negativo', () => {
        const errores = validarProducto({
            ...productoValido,
            stock: -1,
            stockCritico: -5,
        })

        expect(errores.stock).toBeDefined()
        expect(errores.stockCritico).toBeDefined()
    })

    it('rechaza una categoría inexistente', () => {
        const errores = validarProducto({
            ...productoValido,
            categoria: 'categoria-inventada',
        })

        expect(errores.categoria).toBeDefined()
    })

    it('permite stock cero', () => {
        const errores = validarProducto({
            ...productoValido,
            stock: 0,
        })

        expect(errores.stock).toBeUndefined()
    })

    it('permite editar sin considerar duplicado el código original', () => {
        const errores = validarProducto(productoValido, {
            modo: 'editar',
            productosExistentes: [productoValido],
        })

        expect(errores.codigo).toBeUndefined()
    })

    it('ejecuta onCancelar al presionar Cancelar', () => {
        const onCancelar = vi.fn()
        const onGuardar = vi.fn()

        render(
            <FormularioProducto
                onGuardar={onGuardar}
                onCancelar={onCancelar}
            />
        )

        fireEvent.click(screen.getByRole('button', {
            name: 'Cancelar',
        }))

        expect(onCancelar).toHaveBeenCalledOnce()
        expect(onGuardar).not.toHaveBeenCalled()
    })
})
