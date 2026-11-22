
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react'

import InicioAdmin from './InicioAdmin'
import { obtenerProductos } from '../../servicios/productosApi'
import { listarUsuarios } from '../../servicios/usuarios'
import { listarBoletas } from '../../servicios/boletas'

// C3-08: simulamos las tres API sin utilizar la base de datos real.
vi.mock('../../servicios/productosApi', () => ({
    obtenerProductos: vi.fn()
}))

vi.mock('../../servicios/usuarios', () => ({
    listarUsuarios: vi.fn()
}))

vi.mock('../../servicios/boletas', () => ({
    listarBoletas: vi.fn()
}))

// Simulamos únicamente la presentación de las tarjetas.
// Así podemos verificar las estadísticas que InicioAdmin
// entrega a cada tarjeta sin modificar TarjetaResumen.
vi.mock('../../componentes/moleculas/TarjetaResumen', () => ({
    default: ({
                  titulo,
                  cantidad,
                  descripcion,
                  enlace,
                  textoEnlace
              }) => (
        <article aria-label={`Tarjeta ${titulo}`}>
            <h3>{titulo}</h3>
            <p data-testid={`valor-${titulo}`}>
                {cantidad}
            </p>
            <p>{descripcion}</p>
            {enlace && (
                <a href={enlace}>
                    {textoEnlace}
                </a>
            )}
        </article>
    )
}))

describe('C3-08 - Dashboard del administrador', () => {

    const administrador = {
        tipoUsuario: 'Administrador'
    }

    const vendedor = {
        tipoUsuario: 'Vendedor'
    }

    const productos = [
        {
            id: 1,
            codigo: 'TC001',
            nombre: 'Torta de Chocolate',
            stock: 10,
            stockCritico: 3
        },
        {
            id: 2,
            codigo: 'TC002',
            nombre: 'Torta de Frutas',
            stock: 2,
            stockCritico: 5
        },
        {
            id: 3,
            codigo: 'TT001',
            nombre: 'Torta de Vainilla',
            stock: 0,
            stockCritico: 4
        },
        {
            id: 4,
            codigo: 'TT002',
            nombre: 'Torta de Manjar',
            stock: 8,
            stockCritico: 3
        }
    ]

    const usuarios = [
        {
            id: 1,
            tipoUsuario: 'Administrador'
        },
        {
            id: 2,
            tipoUsuario: 'Vendedor'
        },
        {
            id: 3,
            tipoUsuario: 'Cliente'
        },
        {
            id: 4,
            tipoUsuario: 'Cliente'
        }
    ]

    function fechaLocal(diasDeDiferencia = 0) {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() + diasDeDiferencia)

        const anio = fecha.getFullYear()
        const mes = String(
            fecha.getMonth() + 1
        ).padStart(2, '0')
        const dia = String(
            fecha.getDate()
        ).padStart(2, '0')

        return `${anio}-${mes}-${dia}`
    }

    const boletas = [
        {
            id: 1,
            fecha: `${fechaLocal()}T10:30:00`,
            total: 15000
        },
        {
            id: 2,
            fecha: `${fechaLocal()}T15:45:00`,
            total: 25000
        },
        {
            id: 3,
            fecha: `${fechaLocal(-1)}T12:00:00`,
            total: 50000
        }
    ]

    function prepararRespuestas(
        listaProductos = productos,
        listaUsuarios = usuarios,
        listaBoletas = boletas
    ) {
        obtenerProductos.mockResolvedValue(listaProductos)
        listarUsuarios.mockResolvedValue(listaUsuarios)
        listarBoletas.mockResolvedValue(listaBoletas)
    }

    async function esperarResumen() {
        await waitFor(() => {
            expect(
                screen.getByRole('region', {
                    name: 'Resumen del administrador'
                })
            ).toBeInTheDocument()
        })
    }

    beforeEach(() => {
        vi.clearAllMocks()
        prepararRespuestas()
    })

    it('consulta productos, usuarios y boletas desde las API', async () => {
        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        expect(obtenerProductos).toHaveBeenCalledTimes(1)
        expect(listarUsuarios).toHaveBeenCalledTimes(1)
        expect(listarBoletas).toHaveBeenCalledTimes(1)
    })

    it('muestra el total de productos registrados', async () => {
        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        expect(
            screen.getByTestId('valor-Productos')
        ).toHaveTextContent('4')
    })

    it('identifica los productos con stock crítico', async () => {
        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        // TC002 y TT001 tienen stock menor o igual
        // al límite crítico establecido.
        expect(
            screen.getByTestId('valor-Stock crítico')
        ).toHaveTextContent('2')
    })

    it('cuenta correctamente los usuarios por rol', async () => {
        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        expect(
            screen.getByTestId('valor-Administradores')
        ).toHaveTextContent('1')

        expect(
            screen.getByTestId('valor-Vendedores')
        ).toHaveTextContent('1')

        expect(
            screen.getByTestId('valor-Clientes')
        ).toHaveTextContent('2')
    })

    it('calcula las ventas del día excluyendo boletas anteriores', async () => {
        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        // 15.000 + 25.000 = 40.000
        // La boleta de ayer no debe incluirse.
        expect(
            screen.getByTestId('valor-Ventas del día')
        ).toHaveTextContent('$40.000')
    })

    it('muestra ventas del día en cero cuando no hay boletas', async () => {
        prepararRespuestas(productos, usuarios, [])

        render(
            <InicioAdmin sesion={administrador} />
        )

        await esperarResumen()

        expect(
            screen.getByTestId('valor-Ventas del día')
        ).toHaveTextContent('$0')
    })

    it('inicia las tres consultas sin esperar que termine la primera', async () => {
        let resolverProductos
        let resolverUsuarios
        let resolverBoletas

        obtenerProductos.mockReturnValue(
            new Promise(resolve => {
                resolverProductos = resolve
            })
        )

        listarUsuarios.mockReturnValue(
            new Promise(resolve => {
                resolverUsuarios = resolve
            })
        )

        listarBoletas.mockReturnValue(
            new Promise(resolve => {
                resolverBoletas = resolve
            })
        )

        render(
            <InicioAdmin sesion={administrador} />
        )

        // Las tres peticiones deben haberse iniciado,
        // aunque ninguna haya terminado todavía.
        await waitFor(() => {
            expect(obtenerProductos).toHaveBeenCalledTimes(1)
            expect(listarUsuarios).toHaveBeenCalledTimes(1)
            expect(listarBoletas).toHaveBeenCalledTimes(1)
        })

        expect(
            screen.getByText(
                'Cargando resumen del administrador...'
            )
        ).toBeInTheDocument()

        resolverProductos(productos)
        resolverUsuarios(usuarios)
        resolverBoletas(boletas)

        await esperarResumen()
    })

    it('muestra un error cuando falla una petición', async () => {
        obtenerProductos.mockRejectedValue(
            new Error('API de productos desconectada')
        )

        const errorConsola = vi.spyOn(
            console,
            'error'
        ).mockImplementation(() => {})

        try {
            render(
                <InicioAdmin sesion={administrador} />
            )

            expect(
                await screen.findByRole('alert')
            ).toHaveTextContent(
                'No se pudo cargar el resumen del administrador.'
            )

            expect(
                screen.getByRole('button', {
                    name: 'Reintentar'
                })
            ).toBeInTheDocument()
        } finally {
            errorConsola.mockRestore()
        }
    })

    it('permite reintentar después de un error de conexión', async () => {
        obtenerProductos
            .mockRejectedValueOnce(
                new Error('Servidor desconectado')
            )
            .mockResolvedValueOnce(productos)

        const errorConsola = vi.spyOn(
            console,
            'error'
        ).mockImplementation(() => {})

        try {
            render(
                <InicioAdmin sesion={administrador} />
            )

            const botonReintentar = await screen.findByRole(
                'button',
                { name: 'Reintentar' }
            )

            fireEvent.click(botonReintentar)

            await esperarResumen()

            expect(obtenerProductos).toHaveBeenCalledTimes(2)
            expect(listarUsuarios).toHaveBeenCalledTimes(2)
            expect(listarBoletas).toHaveBeenCalledTimes(2)

            expect(
                screen.getByTestId('valor-Productos')
            ).toHaveTextContent('4')
        } finally {
            errorConsola.mockRestore()
        }
    })

    it('no muestra las estadísticas a un Vendedor', () => {
        render(
            <InicioAdmin sesion={vendedor} />
        )

        expect(
            screen.getByText('Acceso restringido')
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('region', {
                name: 'Resumen del administrador'
            })
        ).not.toBeInTheDocument()

        expect(obtenerProductos).not.toHaveBeenCalled()
        expect(listarUsuarios).not.toHaveBeenCalled()
        expect(listarBoletas).not.toHaveBeenCalled()
    })

    it('no consulta estadísticas sin una sesión de Administrador', () => {
        render(
            <InicioAdmin sesion={null} />
        )

        expect(
            screen.getByText('Acceso restringido')
        ).toBeInTheDocument()

        expect(obtenerProductos).not.toHaveBeenCalled()
        expect(listarUsuarios).not.toHaveBeenCalled()
        expect(listarBoletas).not.toHaveBeenCalled()
    })
})
