// Página de inicio de sesión (/login).
// La lógica de buscar al usuario vive en App.jsx; aquí solo se decide a dónde ir después.
import { Link, useLocation, useNavigate } from 'react-router'
import FormularioLogin from '../../componentes/organismos/FormularioLogin'
import { esPerfilInterno } from '../../utils/usuarios'

function Login({ onIniciarSesion }) {
    const navegar = useNavigate()
    const ubicacion = useLocation()

    // Recibe los datos ya validados del formulario.
    // Devuelve true o false para que el formulario sepa si mostrar el error.
    function iniciarSesion({ correo, contrasena }) {
        const usuario = onIniciarSesion(correo, contrasena)
        if (!usuario) return false

        // Si RutaProtegida nos mandó aquí, volvemos a la página que se intentaba abrir
        const paginaAnterior = ubicacion.state?.from?.pathname
        if (paginaAnterior) {
            navegar(paginaAnterior, { replace: true })
        } else {
            // Igual que en la Ev1: Administrador y Vendedor van al panel, Cliente al inicio
            navegar(esPerfilInterno(usuario) ? '/admin' : '/', { replace: true })
        }
        return true
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