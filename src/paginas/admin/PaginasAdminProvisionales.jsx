// Estas ocho páginas permitirán verificar el contrato 
// de rutas sin desarrollar aún formularios ni gestión 
// de datos.
import { Link, useParams } from 'react-router'

function PaginaAdmin({ titulo }) {
    return (
        <main>
            <h2>{titulo}</h2>
            <p>Página administrativa pendiente de migración.</p>
            <Link to="/">Volver a la tienda</Link>
        </main>
    )
}

export function InicioAdmin() {
    return <PaginaAdmin titulo="Panel administrativo" />
}

export function ProductosAdmin() {
    return <PaginaAdmin titulo="Administrar productos" />
}

export function NuevoProducto() {
    return <PaginaAdmin titulo="Nuevo producto" />
}

export function EditarProducto() {
    const { codigo } = useParams()

    return <PaginaAdmin titulo={`Editar producto: ${codigo}`} />
}

export function UsuariosAdmin() {
    return <PaginaAdmin titulo="Administrar usuarios" />
}

export function NuevoUsuario() {
    return <PaginaAdmin titulo="Nuevo usuario" />
}

export function VerUsuario() {
    const { run } = useParams()

    return <PaginaAdmin titulo={`Ver usuario: ${run}`} />
}

export function EditarUsuario() {
    const { run } = useParams()

    return <PaginaAdmin titulo={`Editar usuario: ${run}`} />
}
