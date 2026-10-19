// Organismo: formulario de inicio de sesión.
// Valida con las reglas de utils/validaciones.js y, si todo está bien,
// avisa hacia arriba con onIniciarSesion({ correo, contrasena }).
// onIniciarSesion devuelve true si las credenciales son correctas y false si no.
import { useState } from 'react'
import CampoFormulario from '../atomos/CampoFormulario'
import { validarLogin } from '../../utils/validaciones'

function FormularioLogin({ onIniciarSesion }) {
    const [datos, setDatos] = useState({ correo: '', contrasena: '' })
    const [errores, setErrores] = useState({})
    const [errorGeneral, setErrorGeneral] = useState('')

    // Un solo manejador para todos los campos: usa el "name" del input
    function actualizarCampo(evento) {
        const { name, value } = evento.target
        setDatos((actual) => ({ ...actual, [name]: value }))
        setErrores((actual) => ({ ...actual, [name]: '' }))
        setErrorGeneral('')
    }

    function enviarFormulario(evento) {
        evento.preventDefault()

        const nuevosErrores = validarLogin(datos)
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length > 0) return

        const correcto = onIniciarSesion({
            correo: datos.correo.trim().toLowerCase(),
            contrasena: datos.contrasena,
        })

        if (!correcto) {
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

            <button id="boton-login" type="submit" className="btn btn-principal btn-acceso">
                Iniciar sesión
            </button>
        </form>
    )
}

export default FormularioLogin