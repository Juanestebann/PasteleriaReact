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
// S11: solo se agregan si faltan (por RUN); si el admin las editó, se respeta la versión editada.
export function leerUsuarios() {
    const guardados = leerJSON(CLAVE_USUARIOS, [])
    const lista = Array.isArray(guardados) ? guardados : []

    const internosFaltantes = usuariosIniciales.filter(
        (interno) => !lista.some((usuario) => usuario.run === interno.run)
    )
    return [...internosFaltantes, ...lista]
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

// S12: iniciales para el avatar: "José Cardoza" → "JC"
export function obtenerIniciales(usuario) {
    return `${usuario?.nombre?.[0] ?? ''}${usuario?.apellidos?.[0] ?? ''}`.toUpperCase() || '?'
}

// S12: clase CSS de la insignia según el rol (las mismas de la Ev1)
export function claseRol(rol) {
    if (rol === 'Administrador') return 'rol rol-administrador'
    if (rol === 'Vendedor') return 'rol rol-vendedor'
    return 'rol rol-cliente'
}

// S12: la fecha se guarda como "2004-03-15" (input date); se muestra como "15-03-2004"
export function formatearFecha(fecha) {
    if (!fecha) return '-'
    const [anio, mes, dia] = fecha.split('-')
    return `${dia}-${mes}-${anio}`
}
// Diseño editor: nombre visible de cada campo del formulario de usuario
export const ETIQUETAS_CAMPOS = {
    tipoUsuario: 'Rol',
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    correo: 'Correo',
    fechaNacimiento: 'Fecha de nacimiento',
    region: 'Región',
    comuna: 'Comuna',
    direccion: 'Dirección',
}

// Diseño editor: devuelve los campos que cambiaron respecto del usuario original
export function camposModificados(original, actual) {
    if (!original || !actual) return []
    return Object.keys(ETIQUETAS_CAMPOS).filter(
        (campo) => String(actual[campo] ?? '').trim() !== String(original[campo] ?? '').trim()
    )
}