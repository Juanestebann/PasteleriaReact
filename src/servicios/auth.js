// S3-09: servicio de autenticación. Es el único archivo que conoce las rutas /auth de la API.
// Las páginas no escriben URLs: llaman a estas funciones.
import api from './api'

// POST /auth/login → { accessToken, refreshToken, tipo, expiraEn, usuario }
export async function login(correo, contrasena) {
    const respuesta = await api.post('/auth/login', { correo, contrasena })
    return respuesta.data
}

// POST /auth/registro → crea un CLIENTE y responde igual que el login (queda con sesión iniciada)
export async function registrar(usuario) {
    // Solo se envían los campos que espera la API (sin confirmarContrasena ni tipoUsuario)
    const datos = {
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        fechaNacimiento: usuario.fechaNacimiento || null,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
    }
    const respuesta = await api.post('/auth/registro', datos)
    return respuesta.data
}

// POST /auth/refresh → tokens nuevos (lo usará el interceptor de Juan, J3-04)
export async function refrescar(refreshToken) {
    const respuesta = await api.post('/auth/refresh', { refreshToken })
    return respuesta.data
}

// GET /auth/me → datos del usuario dueño del token
export async function obtenerUsuarioActual(accessToken) {
    const respuesta = await api.get('/auth/me', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
    return respuesta.data
}