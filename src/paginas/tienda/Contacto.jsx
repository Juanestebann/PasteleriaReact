import FormularioContacto from '../../componentes/organismos/FormularioContacto'

function Contacto() {
    return (
        <>
            <section id="contacto-presentacion">
                <article>
                    <p className="texto-dorado texto-dorado-editorial">Estamos para ayudarte</p>
                    <h2>Contáctanos</h2>
                    <p>¿Tienes alguna consulta, sugerencia o necesitas más información sobre nuestros productos?</p>
                    <p>Puedes enviarnos un mensaje utilizando nuestro formulario de contacto y nos comunicaremos contigo.</p>
                </article>
            </section>
            <section id="contacto-principal">
                <article id="informacion-contacto">
                    <h2>Información de contacto</h2>
                    <section className="dato-contacto">
                        <h3>Dirección</h3>
                        <p>📍 Av. San Martín 1234, Concepción</p>
                    </section>
                    <section className="dato-contacto">
                        <h3>Horario</h3>
                        <p>◷ Lun - Dom: 08:00 - 20:00</p>
                    </section>
                    <section className="dato-contacto">
                        <h3>Correo electrónico</h3>
                        <p>✉ contacto@milsabores.cl</p>
                    </section>
                    <section className="dato-contacto">
                        <h3>Teléfono</h3>
                        <p>☎ +56 9 1234 5678</p>
                    </section>
                    <section className="dato-contacto">
                        <h3>Redes sociales</h3>
                        <p>Instagram: @pasteleriamilsabores</p>
                    </section>
                </article>
                <FormularioContacto />
            </section>
            <section id="ubicacion">
                <article>
                    <h2>¿Dónde encontrarnos?</h2>
                    <p>Visítanos en Av. San Martín 1234, Concepción.</p>
                    <section id="mapa"><p>Espacio para mapa o ubicación</p></section>
                </article>
            </section>
        </>
    )
}

export default Contacto
