// ¿Por qué usamos un archivo provisional? Nos permite 
// comprobar todas las rutas sin mezclar J02 con las 
// tareas posteriores de migración HTML a JSX. 
// Cuando desarrollemos las páginas definitivas, cada 
// una tendrá su propio archivo.

import { Link, useParams } from 'react-router'

function PaginaProvisional({ titulo }) {
    return (
        <main>
            <h1>{titulo}</h1>
            <p>Página pendiente de migración a React.</p>

            <Link to="/">Volver al inicio</Link>
        </main>
    )
}

export function Inicio() {
    return <PaginaProvisional titulo="Inicio" />
}

export function Catalogo() {
    return <PaginaProvisional titulo="Catálogo de productos" />
}

export function DetalleProducto() {
    const { codigo } = useParams()

    return (
        <PaginaProvisional titulo={`Producto: ${codigo}`} />
    )
}

export function Carrito() {
    return <PaginaProvisional titulo="Carrito de compras" />
}

export function Login() {
    return <PaginaProvisional titulo="Iniciar sesión" />
}

export function Registro() {
    return <PaginaProvisional titulo="Registro" />
}

export function Nosotros() {
    return <PaginaProvisional titulo="Nosotros" />
}

export function Blogs() {
    return <PaginaProvisional titulo="Blogs" />
}

export function DetalleBlog() {
    const { id } = useParams()

    return <PaginaProvisional titulo={`Blog: ${id}`} />
}

export function Contacto() {
    return <PaginaProvisional titulo="Contacto" />
}

export function NoEncontrada() {
    return (
        <main>
            <h1>404 - Página no encontrada</h1>
            <Link to="/">Volver al inicio</Link>
        </main>
    )
}
