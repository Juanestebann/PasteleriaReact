// Organismo: formulario de inicio de sesión.
// Valida con las reglas de utils/validaciones.js y, si todo está bien,
// avisa hacia arriba con onIniciarSesion({ correo, contrasena }).
// S3-09: onIniciarSesion ahora consulta la API, así que puede ser asíncrona.
//   - Si devuelve un texto, es el mensaje de error que se muestra.
//   - Si devuelve false, se muestra el mensaje de credenciales incorrectas.
//   - Cualquier otro valor significa que el inicio de sesión fue correcto.
import { useState } from 'react'
import CampoFormulario from '../atomos/CampoFormulario'
import { validarLogin } from '../../utils/validaciones'

function FormularioLogin({ onIniciarSesion }) {
    const [datos, setDatos] = useState({ correo: '', contrasena: '' })
    const [errores, setErrores] = useState({})
    const [errorGeneral, setErrorGeneral] = useState('')
    const [enviando, setEnviando] = useState(false)

    // Un solo manejador para todos los campos: usa el "name" del input
    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setDatos((actual) => ({ ...actual, [name]: value }))
        setErrores((actual) => ({ ...actual, [name]: '' }))
        setErrorGeneral('')
    }

    async function enviarFormulario(evento) {
        evento.preventDefault()

        const nuevosErrores = validarLogin(datos)
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length > 0) return

        setEnviando(true)
        const resultado = await onIniciarSesion({
            correo: datos.correo.trim().toLowerCase(),
            contrasena: datos.contrasena,
        })
        setEnviando(false)

        if (typeof resultado === 'string' && resultado !== '') {
            setErrorGeneral(resultado)
        } else if (resultado === false) {
            setErrorGeneral('El email o la contraseña no son correctos.')
        }
    }

    return (
        <form id="formulario-login" className="formulario-acceso" noValidate onSubmit={enviarFormulario}>
            <CampoFormulario
                id="correo"
                etiqueta="Correo electrónico"
                tipo="email"
                valor={datos.correo}
                onChange={actualizarCampo}
                error={errores.correo}
                placeholder="tu@email.com"
                autoComplete="email"
                maxLength={100}
            />

            <CampoFormulario
                id="contrasena"
                etiqueta="Contraseña"
                tipo="password"
                valor={datos.contrasena}
                onChange={actualizarCampo}
                error={errores.contrasena}
                placeholder="Tu contraseña"
                autoComplete="current-password"
            />

            <p id="error-login" className="mensaje-error" role={errorGeneral ? 'alert' : undefined}>
                {errorGeneral}
            </p>

            {/* Mientras espera a la API, el botón se desactiva para no enviar dos veces */}
            <button id="boton-login" type="submit" className="btn btn-principal btn-acceso" disabled={enviando}>
                {enviando ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
        </form>
    )
}

export default FormularioLogin