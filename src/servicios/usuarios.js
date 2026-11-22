// S3-10: servicio de usuarios para el panel del administrador.
// Es el único archivo que conoce las rutas /usuarios de la API (todas solo para ADMINISTRADOR).
// Traduce el rol entre la API ('VENDEDOR') y las pantallas de la Ev2 ('Vendedor').
import api from './api'
import { ROLES, ETIQUETA_ROL } from '../utils/roles'

const ROL_API = {
    Administrador: ROLES.ADMINISTRADOR,
    Vendedor: ROLES.VENDEDOR,
    Cliente: ROLES.CLIENTE,
}

// UsuarioDTO de la API → usuario que entienden TablaUsuarios, VerUsuario y FormularioUsuario
export function usuarioDesdeApi(usuario) {
    return {
        ...usuario,
        fechaNacimiento: usuario.fechaNacimiento ?? '',
        tipoUsuario: ETIQUETA_ROL[usuario.rol] ?? 'Cliente',
    }
}

// Usuario del formulario → UsuarioRequest de la API (sin tipoUsuario ni campos extra)
export function usuarioParaApi(usuario) {
    return {
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        contrasena: usuario.contrasena ?? '', // vacía al editar = se mantiene la actual
        fechaNacimiento: usuario.fechaNacimiento || null,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
        rol: ROL_API[usuario.tipoUsuario],
    }
}

// GET /usuarios
export async function listarUsuarios() {
    const respuesta = await api.get('/usuarios')
    return respuesta.data.map(usuarioDesdeApi)
}

// GET /usuarios/{run}
export async function obtenerUsuario(run) {
    const respuesta = await api.get(`/usuarios/${run}`)
    return usuarioDesdeApi(respuesta.data)
}

// POST /usuarios → 201
export async function crearUsuario(usuario) {
    const respuesta = await api.post('/usuarios', usuarioParaApi(usuario))
    return usuarioDesdeApi(respuesta.data)
}

// PUT /usuarios/{run} → 200
export async function actualizarUsuario(run, usuario) {
    const respuesta = await api.put(`/usuarios/${run}`, usuarioParaApi(usuario))
    return usuarioDesdeApi(respuesta.data)
}

// DELETE /usuarios/{run} → 204 (sin cuerpo)
export async function eliminarUsuario(run) {
    await api.delete(`/usuarios/${run}`)
}