
import TarjetaResumen from '../../componentes/moleculas/TarjetaResumen'

function InicioAdmin({ sesion, productos = [] }) {
    const esAdministrador = sesion?.tipoUsuario === 'Administrador'

    const totalProductos = productos.length

    const productosCriticos = productos.filter(
        (producto) => producto.stock <= producto.stockCritico
    ).length

    const mensajeBienvenida = esAdministrador
        ? 'Como Administrador puedes gestionar productos y usuarios desde este panel.'
        : 'Como Vendedor puedes consultar los productos y revisar las alertas de stock crítico.'

    return (
        <>
            <section id="bienvenida-admin" className="panel">
                <h2>Resumen</h2>
                <p id="mensaje-bienvenida-admin">
                    {mensajeBienvenida}
                </p>
            </section>

            <section id="tarjetas-admin" aria-label="Accesos administrativos">
                <TarjetaResumen
                    titulo="Productos"
                    descripcion="Consulta los productos disponibles y su información de inventario."
                    cantidad={totalProductos}
                    enlace="/admin/productos"
                    textoEnlace="Ver productos"
                />

                {esAdministrador && (
                    <TarjetaResumen
                        titulo="Usuarios"
                        descripcion="Consulta y administra los usuarios registrados en el sistema."
                        enlace="/admin/usuarios"
                        textoEnlace="Ver usuarios"
                    />
                )}

                <TarjetaResumen
                    titulo="Stock crítico"
                    descripcion="Productos que requieren revisar sus existencias."
                    cantidad={productosCriticos}
                    enlace="/admin/productos"
                    textoEnlace="Revisar inventario"
                />
            </section>
        </>
    )
}

export default InicioAdmin
