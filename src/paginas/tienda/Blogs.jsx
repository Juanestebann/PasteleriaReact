// Página Blogs (/blogs). En la Ev1 era blogs.html con las noticias escritas a mano.
// Ahora las noticias vienen de datos/blogs.js y se dibujan con .map().
import TarjetaNoticia from '../../componentes/moleculas/TarjetaNoticia'
import blogs from '../../datos/blogs'

function Blogs() {
    return (
        <main>
            {/* PRESENTACIÓN */}
            <section id="blog-presentacion">
                <article>
                    <p className="texto-dorado texto-dorado-editorial">Actualidad y gastronomía</p>
                    <h2>Blog y noticias</h2>
                    <p>
                        Descubre noticias, experiencias y contenidos relacionados con la gastronomía, la
                        cocina y las actividades que forman parte de este apasionante mundo.
                    </p>
                </article>
            </section>

            {/* LISTA DE NOTICIAS */}
            <section id="lista-noticias">
                {blogs.map((blog) => (
                    <TarjetaNoticia key={blog.id} blog={blog} />
                ))}
            </section>
        </main>
    )
}

export default Blogs