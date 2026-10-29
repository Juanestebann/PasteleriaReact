// Página de una noticia (/blogs/:id).
// En la Ev1 eran dos archivos casi iguales: blog-detalle-1.html y blog-detalle-2.html.
// Ahora es una sola página que busca la noticia por el id de la URL.
import { Fragment } from 'react'
import { Link, useParams } from 'react-router'
import { obtenerBlog } from '../../datos/blogs'

function DetalleBlog() {
    const { id } = useParams()
    const blog = obtenerBlog(id)

    // El id de la URL no corresponde a ninguna noticia
    if (!blog) {
        return (
            <main>
                <section id="detalle-presentacion">
                    <article>
                        <h2>Noticia no encontrada</h2>
                        <p className="detalle-introduccion">La noticia que buscas no existe o fue eliminada.</p>
                    </article>
                </section>
                <section id="detalle-navegacion">
                    <Link className="boton-volver btn btn-oscuro" to="/blogs">
                        ← Volver al blog
                    </Link>
                </section>
            </main>
        )
    }

    return (
        <main>
            {/* PRESENTACIÓN DE LA NOTICIA */}
            <section id="detalle-presentacion">
                <article>
                    <p className="detalle-categoria">{blog.categoria}</p>
                    <p className="detalle-fecha">{blog.fecha}</p>
                    <h2>{blog.titulo}</h2>
                    <p className="detalle-introduccion">{blog.introduccion}</p>
                </article>
            </section>

            {/* IMAGEN PRINCIPAL */}
            <section id="detalle-imagen">
                <img src={blog.imagen} alt={blog.titulo} />
            </section>

            {/* CONTENIDO: cada sección tiene un título y sus párrafos.
                Fragment agrupa sin agregar etiquetas, así el CSS de la Ev1 (h2:first-child) sigue funcionando */}
            <section id="detalle-contenido">
                <article>
                    {blog.secciones.map((seccion) => (
                        <Fragment key={seccion.titulo}>
                            <h2>{seccion.titulo}</h2>
                            {seccion.parrafos.map((parrafo) => (
                                <p key={parrafo}>{parrafo}</p>
                            ))}
                        </Fragment>
                    ))}
                </article>
            </section>

            {/* NAVEGACIÓN */}
            <section id="detalle-navegacion">
                <Link className="boton-volver btn btn-oscuro" to="/blogs">
                    ← Volver al blog
                </Link>
                <a className="boton-fuente" href={blog.fuente} target="_blank" rel="noopener noreferrer">
                    Ver fuente original - Duoc UC
                </a>
            </section>
        </main>
    )
}

export default DetalleBlog