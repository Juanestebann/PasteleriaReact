// Molécula: tarjeta de una noticia en el listado del blog.
// En la Ev1 eran dos <article class="noticia"> escritos a mano en blogs.html.
import { Link } from 'react-router'

function TarjetaNoticia({ blog }) {
    return (
        <article className="noticia">
            <section className="noticia-imagen">
                <img src={blog.imagen} alt={blog.titulo} loading="lazy" />
            </section>

            <section className="noticia-contenido">
                <p className="noticia-categoria">{blog.categoria}</p>
                <p className="noticia-fecha">{blog.fecha}</p>
                <h2>{blog.titulo}</h2>
                <p>{blog.resumen}</p>
                <Link className="boton-noticia btn btn-oscuro" to={`/blogs/${blog.id}`}>
                    Leer noticia
                </Link>
            </section>
        </article>
    )
}

export default TarjetaNoticia