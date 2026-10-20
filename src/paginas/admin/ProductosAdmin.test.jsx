
import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import ProductosAdmin from './ProductosAdmin'
import { productosIniciales } from '../../datos/productos'

const productosPrueba = [
    {
        codigo: 'TC001',
        nombre: 'Torta de Chocolate',
        precio: 45000,
        imagen: '/img/chocolate.png',
        categoria: 'tortas',
        stock: 10,
        stockCritico: 3
    },
    {
        codigo: 'TC002',
        nombre: 'Torta de Frutilla',
        precio: 35000,
        imagen: '/img/frutilla.png',
        categoria: 'tortas',
        stock: 2,
        stockCritico: 3
    },
    {
        codigo: 'GA001',
        nombre: 'Galletas de Vainilla',
        precio: 5000,
        imagen: '/img/galletas.png',
        categoria: 'galletas',
        stock: 0,
        stockCritico: 2
    }
]

function renderizarAdmin(productos = productosPrueba) {
    return render(
        <MemoryRouter>
            <ProductosAdmin productos={productos} />
        </MemoryRouter>
    )
}

describe('C08 - Administración de productos', () => {
    it('muestra los productos registrados', () => {
        renderizarAdmin()

        expect(screen.getByText('TC001')).toBeInTheDocument()
        expect(screen.getByText('TC002')).toBeInTheDocument()
        expect(screen.getByText('GA001')).toBeInTheDocument()
    })

    it('muestra el total de productos', () => {
        renderizarAdmin()

        expect(screen.getByText('Total productos'))
            .toBeInTheDocument()

        expect(screen.getByText('3 productos encontrados'))
            .toBeInTheDocument()
    })

    it('identifica los productos con stock crítico', () => {
        renderizarAdmin()

        const filas = screen.getAllByRole('row')

        expect(filas).toHaveLength(4)
        expect(screen.getByText('Sin stock')).toBeInTheDocument()

        expect(
            screen.getAllByText('Stock crítico').length
        ).toBeGreaterThan(0)
    })

    it('busca productos por nombre', () => {
        renderizarAdmin()

        fireEvent.change(
            screen.getByLabelText('Buscar producto'),
            { target: { value: 'Frutilla' } }
        )

        expect(screen.getByText('TC002')).toBeInTheDocument()
        expect(screen.queryByText('TC001')).not.toBeInTheDocument()
        expect(screen.getByText('1 productos encontrados'))
            .toBeInTheDocument()
    })

    it('busca productos por código', () => {
        renderizarAdmin()

        fireEvent.change(
            screen.getByLabelText('Buscar producto'),
            { target: { value: 'GA001' } }
        )

        expect(screen.getByText('GA001')).toBeInTheDocument()
        expect(screen.queryByText('TC001')).not.toBeInTheDocument()
    })

    it('filtra los productos con stock crítico', () => {
        renderizarAdmin()

        fireEvent.change(
            screen.getByLabelText('Filtrar productos'),
            { target: { value: 'criticos' } }
        )

        expect(screen.queryByText('TC001')).not.toBeInTheDocument()
        expect(screen.getByText('TC002')).toBeInTheDocument()
        expect(screen.getByText('GA001')).toBeInTheDocument()
    })

    it('filtra los productos por categoría', () => {
        renderizarAdmin()

        fireEvent.change(
            screen.getByLabelText('Filtrar productos'),
            { target: { value: 'galletas' } }
        )

        expect(screen.getByText('GA001')).toBeInTheDocument()
        expect(screen.queryByText('TC001')).not.toBeInTheDocument()
    })

    it('muestra un mensaje si no hay coincidencias', () => {
        renderizarAdmin()

        fireEvent.change(
            screen.getByLabelText('Buscar producto'),
            { target: { value: 'Producto inexistente' } }
        )

        expect(screen.getByText('No se encontraron productos.'))
            .toBeInTheDocument()
    })

    it('construye correctamente las rutas de edición', () => {
        renderizarAdmin()

        expect(
            screen.getByRole('link', {
                name: 'Editar Torta de Chocolate'
            })
        ).toHaveAttribute(
            'href',
            '/admin/productos/TC001/editar'
        )
    })

    it('incluye el enlace para crear productos', () => {
        renderizarAdmin()

        expect(
            screen.getByRole('link', {
                name: /Nuevo producto/
            })
        ).toHaveAttribute('href', '/admin/productos/nuevo')
    })

    it('carga los productos reales del catálogo', () => {
        renderizarAdmin(productosIniciales)

        expect(screen.getByText('16 productos encontrados'))
            .toBeInTheDocument()
    })
})
