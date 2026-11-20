// Página de inicio de sesión (/login).
// S3-09: el correo y la contraseña se comprueban en la API (POST /api/v1/auth/login).
// La respuesta (tokens + usuario) se entrega a App, que guarda la sesión.
import { Link, useLocation, useNavigate } from 'react-router'
import FormularioLogin from '../../componentes/organismos/FormularioLogin'
import { login } from '../../servicios/auth'
import { mensajeDeError } from '../../servicios/errores'

// Página a la que va cada rol después de iniciar sesión
const DESTINO_POR_ROL = {
    ADMINISTRADOR: '/admin',
    VENDEDOR: '/admin/productos',
    CLIENTE: '/',
}

function Login({ onIniciarSesion }) {
    const navegar = useNavigate()
    const ubicacion = useLocation()

    // Recibe los datos ya validados del formulario.
    // Devuelve '' si todo salió bien, o el mensaje de error que debe mostrar el formulario.
    async function iniciarSesion({ correo, contrasena }) {
        try {
            const respuesta = await login(correo, contrasena)
            onIniciarSesion(respuesta)

            // Si RutaProtegida nos mandó aquí, volvemos a la página que se intentaba abrir
            const paginaAnterior = ubicacion.state?.from?.pathname
            navegar(paginaAnterior ?? DESTINO_POR_ROL[respuesta.usuario.rol] ?? '/', { replace: true })
            return ''
        } catch (error) {
            // 401: la API dice que el correo o la contraseña no calzan
            if (error.response?.status === 401) return 'El email o la contraseña no son correctos.'
            // Otros casos: API apagada, error del servidor, etc.
            return mensajeDeError(error)
        }
    }

    return (
        <section id="login-principal">
            <section id="login-contenedor">
                {/* LADO IZQUIERDO */}
                <article id="login-imagen">
                    <img src="/img/login1.png" alt="Pastel de chocolate y café de Pastelería Mil Sabores" />
                </article>

                {/* LADO DERECHO */}
                <article id="login-formulario">
                    <section id="login-encabezado">
                        <span className="login-bienvenida">Bienvenido de nuevo</span>
                        <h2>Iniciar sesión</h2>
                        <p>Accede a tu cuenta y sigue disfrutando de los sabores que hacen especial cada momento.</p>
                    </section>

                    <FormularioLogin onIniciarSesion={iniciarSesion} />

                    <section id="login-registro">
                        <p>
                            ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
                        </p>
                    </section>
                </article>
            </section>
        </section>
    )
}

export default Login