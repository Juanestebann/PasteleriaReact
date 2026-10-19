// Lectura y escritura de usuarios y sesión en localStorage.
// Se mantienen las mismas claves de la versión HTML: "usuarios" y "usuarioActivo".
import usuariosIniciales from '../datos/usuariosIniciales'

export const CLAVE_USUARIOS = 'usuarios'
export const CLAVE_SESION = 'usuarioActivo'

// Lee un valor JSON de localStorage.
// Si no existe o está corrupto, devuelve el valor por defecto en vez de romper la página.
export function leerJSON(clave, valorPorDefecto) {
    try {
        const guardado = localStorage.getItem(clave)
        return guardado ? JSON.parse(guardado) : valorPorDefecto
    } catch {
        return valorPorDefecto
    }
}

export function guardarJSON(clave, valor) {
    localStorage.setItem(clave, JSON.stringify(valor))
}

// Devuelve los usuarios guardados, asegurando que las cuentas internas
// (administrador y vendedor) siempre existan, igual que en login.js.
export function leerUsuarios() {
    const guardados = leerJSON(CLAVE_USUARIOS, [])
    const lista = Array.isArray(guardados) ? guardados : []

    const sinInternos = lista.filter(
        (usuario) => !usuariosIniciales.some((interno) => interno.correo === usuario.correo?.toLowerCase())
    )
    return [...usuariosIniciales, ...sinInternos]
}

// Busca un usuario por correo y contraseña. Devuelve el usuario o null.
export function buscarPorCredenciales(usuarios, correo, contrasena) {
    const correoNormalizado = correo.trim().toLowerCase()
    return (
        usuarios.find(
            (usuario) => usuario.correo?.toLowerCase() === correoNormalizado && usuario.contrasena === contrasena
        ) ?? null
    )
}

// La sesión guarda los datos del usuario SIN la contraseña.
export function crearSesion(usuario) {
    const { contrasena: _omitida, ...datosSesion } = usuario
    return datosSesion
}

// Indica si el perfil puede entrar al panel de administración.
export function esPerfilInterno(sesion) {
    return sesion?.tipoUsuario === 'Administrador' || sesion?.tipoUsuario === 'Vendedor'
}