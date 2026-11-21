import { Link } from 'react-router'
import { esPerfilInterno } from '../../utils/usuarios'

// J3-06: reutiliza los estilos de la página 404 existente.
export default function AccesoDenegado({ sesion }) {
    return (
        <main className="pagina-no-encontrada">
            <section className="contenedor-no-encontrada">
                <h1>403</h1>
                <h2>Acceso denegado</h2>
                <p>No tienes permisos para acceder a esta sección.</p>
                <Link to="/" className="btn btn-oscuro">Volver al inicio</Link>
                {esPerfilInterno(sesion) && (
                    <> {' '} <Link to="/admin" className="btn btn-oscuro">Ir al panel</Link> </>
                )}
            </section>
        </main>
    )
}
