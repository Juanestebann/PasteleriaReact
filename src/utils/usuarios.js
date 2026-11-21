
import usuariosIniciales from '../datos/usuariosIniciales'
import { ETIQUETA_ROL, esPersonalInterno } from './roles'

export { ETIQUETA_ROL } from './roles'

export const CLAVE_USUARIOS = 'usuarios'
export const CLAVE_SESION = 'usuarioActivo'

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

export function leerUsuarios() {
    const guardados = leerJSON(CLAVE_USUARIOS, [])
    const lista = Array.isArray(guardados) ? guardados : []

    const internosFaltantes = usuariosIniciales.filter(
        (interno) => !lista.some((usuario) => usuario.run === interno.run)
    )

    return [...internosFaltantes, ...lista]
}

export function crearSesion(usuario) {
    const { contrasena: _omitida, ...datosSesion } = usuario
    return datosSesion
}

// J3-07: adapta el rol del backend a las pantallas existentes.
export function crearSesionDesdeApi(respuesta) {
    const { accessToken, refreshToken, usuario } = respuesta

    return {
        ...usuario,
        fechaNacimiento: usuario.fechaNacimiento ?? '',
        tipoUsuario: ETIQUETA_ROL[usuario.rol] ?? 'Cliente',
        accessToken,
        refreshToken,
    }
}

export function esPerfilInterno(sesion) {
    return esPersonalInterno(sesion)
}

export function obtenerIniciales(usuario) {
    return `${usuario?.nombre?.[0] ?? ''}${usuario?.apellidos?.[0] ?? ''}`.toUpperCase() || '?'
}

export function claseRol(rol) {
    if (rol === 'Administrador') return 'rol rol-administrador'
    if (rol === 'Vendedor') return 'rol rol-vendedor'
    return 'rol rol-cliente'
}

export function formatearFecha(fecha) {
    if (!fecha) return '-'

    const [anio, mes, dia] = fecha.split('-')
    return `${dia}-${mes}-${anio}`
}

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

export function camposModificados(original, actual) {
    if (!original || !actual) return []

    return Object.keys(ETIQUETAS_CAMPOS).filter(
        (campo) => String(actual[campo] ?? '').trim() !== String(original[campo] ?? '').trim()
    )
}
