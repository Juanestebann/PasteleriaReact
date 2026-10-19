// Página de registro de clientes (/registro).
// Usa el mismo FormularioUsuario que el administrador, en modo "registro".
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import FormularioUsuario from '../../componentes/organismos/FormularioUsuario'

function Registro({ usuarios = [], onRegistrar }) {
    const navegar = useNavigate()
    const [registrado, setRegistrado] = useState(false)

    // Igual que en la Ev1: se muestra el mensaje de éxito
    // y después de 1,5 segundos se vuelve al inicio.
    useEffect(() => {
        if (!registrado) return
        const temporizador = setTimeout(() => navegar('/'), 1500)
        return () => clearTimeout(temporizador) // si el usuario se va antes, se cancela
    }, [registrado, navegar])

    function guardarUsuario(usuario) {
        onRegistrar(usuario)
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
                    usuariosExistentes={usuarios}
                    onGuardar={guardarUsuario}
                    textoBoton="Crear cuenta"
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