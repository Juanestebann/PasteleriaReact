// S3-09: convierte un error de axios en un mensaje para mostrar en pantalla.
// Distingue los 3 casos del tutorial de axios:
//   1. error.response → el servidor respondió con un error (400, 401, 404, 409...)
//   2. error.request  → la petición salió, pero el servidor no contestó (API apagada)
//   3. otro caso      → error al armar la petición
export function mensajeDeError(error) {
    if (error?.response) {
        return error.response.data?.mensaje || `El servidor respondió con el código ${error.response.status}.`
    }
    if (error?.request) {
        return 'No hay conexión con el servidor. Revisa que la API esté encendida e intenta de nuevo.'
    }
    return error?.message || 'Ocurrió un error inesperado.'
}

// Devuelve los errores por campo que envía la API en un 400: { campos: { correo: '...' } }
export function erroresDeCampos(error) {
    const campos = error?.response?.data?.campos
    return campos && typeof campos === 'object' ? campos : {}
}