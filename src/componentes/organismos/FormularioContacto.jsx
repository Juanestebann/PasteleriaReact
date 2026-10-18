import { useState } from 'react'

const valoresIniciales = { nombre: '', correo: '', asunto: '', mensaje: '' }

function validarFormulario(datos) {
    const errores = {}
    const nombre = datos.nombre.trim()
    const correo = datos.correo.trim().toLowerCase()
    const asunto = datos.asunto.trim()
    const mensaje = datos.mensaje.trim()

    if (!nombre) errores.nombre = 'El nombre es obligatorio.'
    else if (nombre.length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.'
    else if (nombre.length > 100) errores.nombre = 'El nombre no puede superar los 100 caracteres.'

    if (!correo) errores.correo = 'El correo es obligatorio.'
    else if (correo.length > 100) errores.correo = 'El correo no puede superar los 100 caracteres.'
    else if (!['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'].some(dominio => correo.endsWith(dominio)) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errores.correo = 'Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    }

    if (asunto.length > 100) errores.asunto = 'El asunto no puede superar los 100 caracteres.'

    if (!mensaje) errores.mensaje = 'El mensaje es obligatorio.'
    else if (mensaje.length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    else if (mensaje.length > 500) errores.mensaje = 'El mensaje no puede superar los 500 caracteres.'

    return errores
}

function FormularioContacto() {
    const [datos, setDatos] = useState(valoresIniciales)
    const [errores, setErrores] = useState({})
    const [aviso, setAviso] = useState('')

    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setDatos(actual => ({ ...actual, [name]: value }))
        setErrores(actual => ({ ...actual, [name]: '' }))
        setAviso('')
    }

    function enviarFormulario(evento) {
        evento.preventDefault()
        const nuevosErrores = validarFormulario(datos)
        setErrores(nuevosErrores)
        setAviso('')
        if (Object.keys(nuevosErrores).length > 0) {
            const primerCampo = Object.keys(nuevosErrores)[0]
            document.getElementById(primerCampo)?.focus()
            return
        }
        // No hay API de contacto: validar no significa que se haya enviado un mensaje.
        setAviso('Formulario validado correctamente. El envío de mensajes todavía no está disponible.')
    }

    return (
        <article id="formulario-contacto">
            <h2>Envíanos un mensaje</h2>
            <form id="formulario" className="formulario-contacto" noValidate onSubmit={enviarFormulario}>
                <section className="campo-formulario">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input type="text" id="nombre" name="nombre" maxLength={100} placeholder="Ingrese su nombre" autoComplete="name" value={datos.nombre} onChange={actualizarCampo} aria-invalid={Boolean(errores.nombre)} aria-describedby={errores.nombre ? 'error-nombre' : undefined} />
                    <p className="mensaje-error" id="error-nombre" role={errores.nombre ? 'alert' : undefined}>{errores.nombre || ''}</p>
                </section>
                <section className="campo-formulario">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input type="email" id="correo" name="correo" maxLength={100} placeholder="ejemplo@gmail.com" autoComplete="email" value={datos.correo} onChange={actualizarCampo} aria-invalid={Boolean(errores.correo)} aria-describedby={errores.correo ? 'error-correo' : undefined} />
                    <p className="mensaje-error" id="error-correo" role={errores.correo ? 'alert' : undefined}>{errores.correo || ''}</p>
                </section>
                <section className="campo-formulario">
                    <label htmlFor="asunto">Asunto</label>
                    <input type="text" id="asunto" name="asunto" maxLength={100} placeholder="Ingrese el asunto" value={datos.asunto} onChange={actualizarCampo} aria-invalid={Boolean(errores.asunto)} aria-describedby={errores.asunto ? 'error-asunto' : undefined} />
                    <p className="mensaje-error" id="error-asunto" role={errores.asunto ? 'alert' : undefined}>{errores.asunto || ''}</p>
                </section>
                <section className="campo-formulario">
                    <label htmlFor="mensaje">Mensaje</label>
                    <textarea id="mensaje" name="mensaje" maxLength={500} placeholder="Escriba su mensaje" value={datos.mensaje} onChange={actualizarCampo} aria-invalid={Boolean(errores.mensaje)} aria-describedby={errores.mensaje ? 'error-mensaje' : undefined} />
                    <p className="mensaje-error" id="error-mensaje" role={errores.mensaje ? 'alert' : undefined}>{errores.mensaje || ''}</p>
                </section>
                <button type="submit" className="btn btn-oscuro">Enviar mensaje</button>
                <p id="mensaje-exito" role="status" aria-live="polite">{aviso}</p>
            </form>
        </article>
    )
}

export default FormularioContacto
