
import { Link } from 'react-router'

export default function NoEncontrada() {
    return (
        <main className="pagina-no-encontrada">
            <section className="contenedor-no-encontrada">
                <h1>404</h1>
                <h2>Página no encontrada</h2>
                <p>
                    Lo sentimos, la página que buscas no existe
                    o ha cambiado de dirección.
                </p>
                <Link to="/" className="btn btn-oscuro">
                    Volver al inicio
                </Link>
            </section>
        </main>
    )
}
