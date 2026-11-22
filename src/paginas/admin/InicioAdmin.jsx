
import { useEffect, useState } from 'react'
import TarjetaResumen from '../../componentes/moleculas/TarjetaResumen'
import { obtenerProductos } from '../../servicios/productosApi'
import { listarUsuarios } from '../../servicios/usuarios'
import { listarBoletas } from '../../servicios/boletas'

const resumenInicial = {
    totalProductos: 0,
    productosCriticos: 0,
    administradores: 0,
    vendedores: 0,
    clientes: 0,
    ventasHoy: 0
}

const formatearPrecio = (valor) =>
    '$' + valor.toLocaleString('es-CL')

function fechaLocalActual() {
    const hoy = new Date()

    const anio = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')

    return `${anio}-${mes}-${dia}`
}

function calcularResumen(productos, usuarios, boletas) {
    const hoy = fechaLocalActual()

    return {
        totalProductos: productos.length,

        productosCriticos: productos.filter(
            producto => producto.stock <= producto.stockCritico
        ).length,

        administradores: usuarios.filter(
            usuario => usuario.tipoUsuario === 'Administrador'
        ).length,

        vendedores: usuarios.filter(
            usuario => usuario.tipoUsuario === 'Vendedor'
        ).length,

        clientes: usuarios.filter(
            usuario => usuario.tipoUsuario === 'Cliente'
        ).length,

        ventasHoy: boletas
            .filter(boleta => String(boleta.fecha).slice(0, 10) === hoy)
            .reduce(
                (total, boleta) => total + Number(boleta.total),
                0
            )
    }
}

function InicioAdmin({ sesion }) {
    const esAdministrador = sesion?.tipoUsuario === 'Administrador'

    const [resumen, setResumen] = useState(resumenInicial)
    const [cargando, setCargando] = useState(esAdministrador)
    const [error, setError] = useState('')
    const [intentos, setIntentos] = useState(0)

    useEffect(() => {
        if (!esAdministrador) return

        let activo = true

        async function cargarResumen() {
            setCargando(true)
            setError('')

            try {
                // C3-08: ejecutar las solicitudes en paralelo.
                const [productos, usuarios, boletas] = await Promise.all([
                    obtenerProductos(),
                    listarUsuarios(),
                    listarBoletas()
                ])

                if (!activo) return

                if (
                    !Array.isArray(productos) ||
                    !Array.isArray(usuarios) ||
                    !Array.isArray(boletas)
                ) {
                    throw new Error('Respuesta inválida de la API')
                }

                setResumen(
                    calcularResumen(productos, usuarios, boletas)
                )
            } catch (errorCarga) {
                if (!activo) return

                console.error(
                    'No se pudo cargar el resumen administrativo:',
                    errorCarga
                )

                setError(
                    'No se pudo cargar el resumen del administrador.'
                )
            } finally {
                if (activo) {
                    setCargando(false)
                }
            }
        }

        cargarResumen()

        return () => {
            activo = false
        }
    }, [esAdministrador, intentos])

    // El vendedor no debe visualizar estadísticas administrativas.
    if (!esAdministrador) {
        return (
            <section id="bienvenida-admin" className="panel">
                <h2>Acceso restringido</h2>
                <p>
                    El resumen del administrador no está disponible
                    para este perfil.
                </p>
            </section>
        )
    }

    return (
        <>
            <section id="bienvenida-admin" className="panel">
                <h2>Resumen</h2>

                <p id="mensaje-bienvenida-admin">
                    Como Administrador puedes consultar las estadísticas
                    del negocio y gestionar productos y usuarios.
                </p>
            </section>

            {cargando && (
                <section className="panel">
                    <p role="status">
                        Cargando resumen del administrador...
                    </p>
                </section>
            )}

            {error && (
                <section className="panel" role="alert">
                    <p>{error}</p>

                    <button
                        type="button"
                        className="btn btn-principal"
                        onClick={() =>
                            setIntentos(actuales => actuales + 1)
                        }
                    >
                        Reintentar
                    </button>
                </section>
            )}

            {!cargando && !error && (
                <section
                    id="tarjetas-admin"
                    aria-label="Resumen del administrador"
                >
                    <TarjetaResumen
                        titulo="Productos"
                        descripcion="Total de productos registrados en el inventario."
                        cantidad={resumen.totalProductos}
                        enlace="/admin/productos"
                        textoEnlace="Ver productos"
                    />

                    <TarjetaResumen
                        titulo="Stock crítico"
                        descripcion="Productos que requieren revisar sus existencias."
                        cantidad={resumen.productosCriticos}
                        enlace="/admin/productos"
                        textoEnlace="Revisar inventario"
                    />

                    <TarjetaResumen
                        titulo="Administradores"
                        descripcion="Usuarios con perfil de administrador."
                        cantidad={resumen.administradores}
                        enlace="/admin/usuarios"
                        textoEnlace="Ver usuarios"
                    />

                    <TarjetaResumen
                        titulo="Vendedores"
                        descripcion="Usuarios con perfil de vendedor."
                        cantidad={resumen.vendedores}
                        enlace="/admin/usuarios"
                        textoEnlace="Ver usuarios"
                    />

                    <TarjetaResumen
                        titulo="Clientes"
                        descripcion="Usuarios registrados como clientes."
                        cantidad={resumen.clientes}
                        enlace="/admin/usuarios"
                        textoEnlace="Ver usuarios"
                    />

                    <TarjetaResumen
                        titulo="Ventas del día"
                        descripcion="Suma de los totales de las boletas registradas hoy."
                        cantidad={formatearPrecio(resumen.ventasHoy)}
                    />
                </section>
            )}
        </>
    )
}

export default InicioAdmin
