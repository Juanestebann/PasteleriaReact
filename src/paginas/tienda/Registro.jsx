// Página de registro de clientes (/registro).
// Usa el mismo FormularioUsuario que el administrador, en modo "registro".
// S3-09: el usuario se crea en la API (POST /api/v1/auth/registro), que responde con
// los tokens; App guarda la sesión y el cliente queda conectado, igual que en la Ev2.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'
import { registrar } from '../../servicios/auth'

function Registro({ onRegistrar }) {
    const navegar = useNavigate()
    const [registrado, setRegistrado] = useState(false)

    // Igual que en la Ev1: se muestra el mensaje de éxito
    // y después de 1,5 segundos se vuelve al inicio.
    useEffect(() => {
        if (!registrado) return
        const temporizador = setTimeout(() => navegar('/'), 1500)
        return () => clearTimeout(temporizador) // si el usuario se va antes, se cancela
    }, [registrado, navegar])

    // Si la API responde con error (400 o 409), el error sube al formulario,
    // que lo muestra bajo cada campo o como mensaje general.
    async function guardarUsuario(usuario) {
        const respuesta = await registrar(usuario)
        onRegistrar(respuesta)
        setRegistrado(true)
    }

    return (
        <section id="registro-principal">
            <section id="registro-contenedor">
                <section id="registro-encabezado">
                    <span className="registro-bienvenida">Únete a nosotros</span>
                    <h2>Crear cuenta</h2>
                    <p>Regístrate en Pastelería Mil Sabores y comienza a disfrutar de nuestros productos.</p>
                </section>

                <FormularioUsuario
                    modo="registro"
                    onGuardar={guardarUsuario}
                    textoBoton="Crear cuenta"
                    textoEnviando="Creando cuenta…"
                    mensajeExito="Usuario creado exitosamente."
                />

                <section id="registro-login">
                    <p>
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </section>
            </section>
        </section>
    )
}

export default Registro