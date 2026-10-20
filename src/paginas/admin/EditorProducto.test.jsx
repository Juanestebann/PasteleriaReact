
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import EditorProducto from './EditorProducto'
import { productosIniciales } from '../../datos/productos'

function renderizarEditor({
    ruta = '/admin/productos/nuevo',
    onCrear = vi.fn(),
    onActualizar = vi.fn(),
} = {}) {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Routes>
                <Route
                    path="/admin/productos/nuevo"
                    element={
                        <EditorProducto
                            productos={productosIniciales}
                            onCrear={onCrear}
                            onActualizar={onActualizar}
                        />
                    }
                />
                <Route
                    path="/admin/productos/:codigo/editar"
                    element={
                        <EditorProducto
                            productos={productosIniciales}
                            onCrear={onCrear}
                            onActualizar={onActualizar}
                        />
                    }
                />
                <Route
                    path="/admin/productos"
                    element={<h1>Listado de productos</h1>}
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('C10 - EditorProducto', () => {
    it('muestra el formulario vacío para crear productos', () => {
        renderizarEditor()

        expect(screen.getByRole('heading', {
            name: 'Nuevo producto',
        })).toBeTruthy()

        expect(screen.getByLabelText('Código').value).toBe('')

        expect(screen.getByRole('button', {
            name: 'Crear producto',
        })).toBeTruthy()
    })

    it('carga los datos del producto seleccionado al editar', () => {
        renderizarEditor({
            ruta: '/admin/productos/TC001/editar',
        })

        expect(screen.getByRole('heading', {
            name: 'Editar producto',
        })).toBeTruthy()

        expect(screen.getByLabelText('Código').value).toBe('TC001')
        expect(screen.getByLabelText('Código').disabled).toBe(true)

        expect(screen.getByLabelText('Precio').value).toBe('45000')
    })

    it('muestra un mensaje cuando el producto no existe', () => {
        renderizarEditor({
            ruta: '/admin/productos/NOEXISTE/editar',
        })

        expect(screen.getByText('Producto no encontrado'))
            .toBeTruthy()

        expect(screen.queryByRole('button', {
            name: 'Guardar cambios',
        })).toBeNull()
    })

    it('no permite crear un producto con formulario vacío', () => {
        const onCrear = vi.fn()

        renderizarEditor({ onCrear })

        fireEvent.click(screen.getByRole('button', {
            name: 'Crear producto',
        }))

        expect(onCrear).not.toHaveBeenCalled()
        expect(screen.getAllByRole('alert').length)
            .toBeGreaterThan(0)
    })

    it('actualiza un producto existente y vuelve al listado', () => {
        const onActualizar = vi.fn()

        renderizarEditor({
            ruta: '/admin/productos/TC001/editar',
            onActualizar,
        })

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '48000' },
        })

        fireEvent.click(screen.getByRole('button', {
            name: 'Guardar cambios',
        }))

        expect(onActualizar).toHaveBeenCalledWith(
            expect.objectContaining({
                codigo: 'TC001',
                precio: 48000,
            })
        )

        expect(screen.getByRole('heading', {
            name: 'Listado de productos',
        })).toBeTruthy()
    })

    it('permite cancelar y regresar al listado', () => {
        renderizarEditor()

        fireEvent.click(screen.getByRole('button', {
            name: 'Cancelar',
        }))

        expect(screen.getByRole('heading', {
            name: 'Listado de productos',
        })).toBeTruthy()
    })

    // C11 - Pruebas adicionales de creación y edición

    it('crea un producto válido y regresa al listado', () => {
        const onCrear = vi.fn()

        renderizarEditor({ onCrear })

        fireEvent.change(screen.getByLabelText('Código'), {
            target: { value: 'TEST001' },
        })

        fireEvent.change(screen.getByLabelText('Nombre'), {
            target: { value: 'Torta de prueba' },
        })

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '15000' },
        })

        fireEvent.change(screen.getByLabelText('Imagen'), {
            target: { value: '/img/torta-prueba.png' },
        })

        fireEvent.change(screen.getByLabelText('Descripción'), {
            target: { value: 'Torta utilizada para pruebas' },
        })

        fireEvent.change(screen.getByLabelText('Categoría'), {
            target: { value: 'cuadradas' },
        })

        fireEvent.change(screen.getByLabelText('Stock'), {
            target: { value: '10' },
        })

        fireEvent.change(screen.getByLabelText('Stock crítico'), {
            target: { value: '3' },
        })

        fireEvent.click(screen.getByRole('button', {
            name: 'Crear producto',
        }))

        expect(onCrear).toHaveBeenCalledTimes(1)

        expect(onCrear).toHaveBeenCalledWith(
            expect.objectContaining({
                codigo: 'TEST001',
                nombre: 'Torta de prueba',
                precio: 15000,
                imagen: '/img/torta-prueba.png',
                descripcion: 'Torta utilizada para pruebas',
                categoria: 'cuadradas',
                stock: 10,
                stockCritico: 3,
            })
        )

        expect(screen.getByRole('heading', {
            name: 'Listado de productos',
        })).toBeInTheDocument()
    })

    it('mantiene el código original al editar un producto', () => {
        const onActualizar = vi.fn()

        renderizarEditor({
            ruta: '/admin/productos/TC001/editar',
            onActualizar,
        })

        expect(screen.getByLabelText('Código')).toBeDisabled()

        fireEvent.change(screen.getByLabelText('Precio'), {
            target: { value: '50000' },
        })

        fireEvent.click(screen.getByRole('button', {
            name: 'Guardar cambios',
        }))

        expect(onActualizar).toHaveBeenCalledWith(
            expect.objectContaining({
                codigo: 'TC001',
                precio: 50000,
            })
        )
    })
})
