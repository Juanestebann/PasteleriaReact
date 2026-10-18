
function Nosotros() {
    return (
        <>
            {/* SOBRE NOSOTROS */}
            <section id="sobre-nosotros">
                <article id="sobre-nosotros-texto">
                    <p className="texto-dorado texto-dorado-editorial">
                        Conoce nuestra historia
                    </p>

                    <h1>Sobre Pastelería Mil Sabores</h1>

                    <p>
                        Pastelería Mil Sabores es una empresa dedicada
                        a la elaboración y venta de productos de
                        pastelería, creada para entregar momentos
                        dulces y especiales a nuestros clientes.
                    </p>

                    <p>
                        Nos caracteriza nuestra variedad de productos,
                        la dedicación en cada preparación y una
                        atención cercana para quienes nos visitan.
                    </p>
                </article>

                <article id="sobre-nosotros-imagen">
                    <img
                        src="/img/NosotrosLogo.png"
                        alt="Logo de Pastelería Mil Sabores"
                    />
                </article>
            </section>

            {/* NUESTRA HISTORIA */}
            <section id="historia">
                <article>
                    <h2>Nuestra historia</h2>

                    <p>
                        Pastelería Mil Sabores nace con el objetivo
                        de ofrecer productos de pastelería preparados
                        con dedicación y pensados para compartir en
                        diferentes momentos y celebraciones.
                    </p>

                    <p>
                        Con el paso del tiempo, hemos ampliado nuestra
                        variedad de productos buscando entregar nuevas
                        alternativas y mantener una experiencia cercana
                        con nuestros clientes.
                    </p>
                </article>
            </section>

            {/* MISIÓN */}
            <section id="mision">
                <article className="tarjeta-mision">
                    <h2>Nuestra misión</h2>

                    <p>
                        Entregar productos de pastelería de calidad,
                        preparados con dedicación y ofreciendo una
                        atención cercana que permita crear
                        experiencias agradables para nuestros clientes.
                    </p>
                </article>
            </section>

            {/* VALORES */}
            <section id="valores">
                <h2>Nuestros valores</h2>

                <section id="lista-valores">
                    <article className="valor">
                        <h3>Calidad</h3>

                        <p>
                            Buscamos entregar productos preparados
                            cuidadosamente y mantener un buen estándar
                            en cada elaboración.
                        </p>
                    </article>

                    <article className="valor">
                        <h3>Cercanía</h3>

                        <p>
                            Queremos entregar una atención amable
                            y cercana a cada persona que visita
                            nuestra pastelería.
                        </p>
                    </article>

                    <article className="valor">
                        <h3>Compromiso</h3>

                        <p>
                            Trabajamos con dedicación para entregar
                            una buena experiencia y responder a las
                            necesidades de nuestros clientes.
                        </p>
                    </article>
                </section>
            </section>

            {/* DESARROLLADORES */}
            <section id="desarrolladores">
                <h2>Desarrolladores</h2>

                <p id="texto-desarrolladores">
                    Este sitio web fue desarrollado por estudiantes
                    de Ingeniería Informática, responsables de
                    construir la experiencia digital de
                    Pastelería Mil Sabores.
                </p>

                <section id="lista-desarrolladores">
                    <article className="desarrollador">
                        <h3>Catalina Díaz Moraga</h3>
                        <p>Desarrolladora FrontEnd</p>
                    </article>

                    <article className="desarrollador">
                        <h3>José Cardoza Miranda</h3>
                        <p>Desarrollador FrontEnd</p>
                    </article>

                    <article className="desarrollador">
                        <h3>Juan Núñez Sánchez</h3>
                        <p>Desarrollador FrontEnd</p>
                    </article>
                </section>
            </section>

            {/* COMPROMISO */}
            <section id="compromiso">
                <article>
                    <h2>Nuestro compromiso</h2>

                    <p>
                        En Pastelería Mil Sabores queremos ser parte
                        de tus momentos especiales, ofreciendo
                        variedad, dedicación y una atención que
                        te haga sentir siempre bienvenido.
                    </p>
                </article>
            </section>
        </>
    )
}

export default Nosotros
