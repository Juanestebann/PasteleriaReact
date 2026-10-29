// Molécula: tarjeta corta de una noticia en el Inicio (al lado de la promoción).
// En la Ev1 eran dos <article class="blog-home"> escritos a mano en index.html.
import { Link } from 'react-router'

function TarjetaBlogInicio({ blog }) {
    const { etiqueta, titulo, resumen } = blog.inicio

    return (
        <article className="blog-home">
            <h3>{etiqueta}</h3>
            <h2>{titulo}</h2>
            <p>{resumen}</p>
            <Link className="boton-blog" to={`/blogs/${blog.id}`}>
                Leer más
            </Link>
        </article>
    )
}

export default TarjetaBlogInicio