
import { Link, useNavigate, useParams } from 'react-router'
import FormularioProducto from '../../componentes/organismos/FormularioProducto'
import { buscarProductoPorCodigo } from '../../utils/productos'

function EditorProducto({
    productos = [],
    onCrear,
    onActualizar,
}) {
    const { codigo } = useParams()
    const navegar = useNavigate()

    const modo = codigo ? 'editar' : 'nuevo'
    const esEdicion = modo === 'editar'

    const productoEditado = esEdicion
        ? buscarProductoPorCodigo(productos, codigo)
        : null

    function guardar(producto) {
        if (esEdicion) {
            onActualizar(producto)
        } else {
            onCrear(producto)
        }

        navegar('/admin/productos')
    }

    return (
        <main
            id="principal-admin"
            className="productos-admin-react"
        >
            <section
                id={
                    esEdicion
                        ? 'editar-producto-presentacion'
                        : 'nuevo-producto-presentacion'
                }
                className="panel panel-presentacion presentacion-acciones"
            >
                <div>
                    <h2>
                        {esEdicion
                            ? 'Editar producto'
                            : 'Nuevo producto'}
                    </h2>

                    <p>
                        {esEdicion
                            ? 'Modifica los datos del producto seleccionado.'
                            : 'Registra un nuevo producto en el inventario.'}
                    </p>
                </div>

                <Link
                    id="volver-productos"
                    className="btn btn-admin btn-secundario"
                    to="/admin/productos"
                >
                    ← Volver a productos
                </Link>
            </section>

            {esEdicion && !productoEditado ? (
                <section className="panel">
                    <h3>Producto no encontrado</h3>
                    <p>
                        No existe un producto registrado con el código
                        solicitado.
                    </p>
                    <Link to="/admin/productos">
                        Volver al listado
                    </Link>
                </section>
            ) : (
                <section className="panel panel-con-borde editor-producto-panel">
                    <FormularioProducto
                        key={codigo ?? 'nuevo'}
                        modo={modo}
                        productoInicial={productoEditado}
                        productosExistentes={productos}
                        onGuardar={guardar}
                        onCancelar={() => navegar('/admin/productos')}
                    />
                </section>
            )}
        </main>
    )
}

export default EditorProducto
