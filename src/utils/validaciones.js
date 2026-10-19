// Reglas de validación de Pastelería Mil Sabores.
// Antes estaban copiadas en registro.js, login.js, nuevo-usuario.js y editar-usuario.js.
// Ahora viven en un solo archivo y los formularios las reutilizan.
//
// Convención: cada función devuelve '' (texto vacío) si el dato es válido,
// o el mensaje de error que verá el usuario si no lo es.

export const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

// ---------- RUN ----------

// Revisa el RUN con el dígito verificador (módulo 11). Formato: 19011022K
export function esRunValido(run) {
    const texto = String(run).trim().toUpperCase()

    if (texto.length < 7 || texto.length > 9) return false
    if (texto.includes('.') || texto.includes('-')) return false

    const cuerpo = texto.slice(0, -1)
    const digitoIngresado = texto.slice(-1)

    if (!/^\d+$/.test(cuerpo)) return false

    let suma = 0
    let multiplicador = 2

    // De derecha a izquierda, multiplicando por 2, 3, 4, 5, 6, 7, 2, 3...
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
    }

    const resto = 11 - (suma % 11)
    let digitoCalculado = String(resto)
    if (resto === 11) digitoCalculado = '0'
    if (resto === 10) digitoCalculado = 'K'

    return digitoCalculado === digitoIngresado
}

export function validarRun(run) {
    const texto = String(run).trim()
    if (texto === '') return 'El RUN es obligatorio.'
    if (!esRunValido(texto)) return 'Ingrese un RUN válido, sin puntos ni guion.'
    return ''
}

// ---------- Correo y contraseña ----------

export function validarCorreo(correo) {
    const texto = String(correo).trim().toLowerCase()

    if (texto === '') return 'El correo es obligatorio.'
    if (texto.length > 100) return 'El correo no puede superar los 100 caracteres.'

    const dominioPermitido = DOMINIOS_PERMITIDOS.some((dominio) => texto.endsWith(dominio))
    const formatoCorrecto = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)

    if (!dominioPermitido || !formatoCorrecto) {
        return 'Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    }
    return ''
}

export function validarContrasena(contrasena) {
    if (contrasena === '') return 'La contraseña es obligatoria.'
    if (contrasena.length < 4 || contrasena.length > 10) {
        return 'La contraseña debe tener entre 4 y 10 caracteres.'
    }
    return ''
}

export function validarConfirmacion(contrasena, confirmacion) {
    if (confirmacion === '') return 'Debe confirmar la contraseña.'
    if (confirmacion !== contrasena) return 'Las contraseñas no coinciden.'
    return ''
}

// ---------- Textos y fechas ----------

// Texto obligatorio con largo máximo (nombre, apellidos, dirección...)
export function validarTextoObligatorio(valor, mensajeVacio, maximo, mensajeLargo) {
    const texto = String(valor).trim()
    if (texto === '') return mensajeVacio
    if (texto.length > maximo) return mensajeLargo
    return ''
}

// La fecha de nacimiento es opcional, pero no puede ser futura.
// "hoy" se recibe como parámetro para poder probarla sin depender del día.
export function validarFechaNacimiento(fecha, hoy = new Date()) {
    if (!fecha) return ''
    if (new Date(fecha) > hoy) return 'La fecha de nacimiento no puede ser futura.'
    return ''
}

// ---------- Formularios completos ----------

// Formulario de inicio de sesión: devuelve un objeto con los errores encontrados
export function validarLogin({ correo, contrasena }) {
    const errores = {}
    const errorCorreo = validarCorreo(correo)
    const errorContrasena = validarContrasena(contrasena)
    if (errorCorreo) errores.correo = errorCorreo
    if (errorContrasena) errores.contrasena = errorContrasena
    return errores
}

// Formulario de usuario en sus 3 modos:
//   'registro' → cliente que se registra en la tienda
//   'nuevo'    → el administrador crea un usuario (elige el tipo)
//   'editar'   → el administrador edita (el RUN no cambia y no se pide contraseña)
export function validarUsuario(datos, { modo = 'registro', usuariosExistentes = [], hoy = new Date() } = {}) {
    const errores = {}
    const agregar = (campo, mensaje) => {
        if (mensaje) errores[campo] = mensaje
    }

    const run = datos.run.trim().toUpperCase()
    const correo = datos.correo.trim().toLowerCase()

    if (modo !== 'editar') agregar('run', validarRun(run))

    agregar('nombre', validarTextoObligatorio(datos.nombre, 'El nombre es obligatorio.', 50,
        'El nombre no puede superar los 50 caracteres.'))
    agregar('apellidos', validarTextoObligatorio(datos.apellidos, 'Los apellidos son obligatorios.', 100,
        'Los apellidos no pueden superar los 100 caracteres.'))
    agregar('correo', validarCorreo(correo))
    agregar('fechaNacimiento', validarFechaNacimiento(datos.fechaNacimiento, hoy))
    agregar('region', datos.region ? '' : 'Debe seleccionar una región.')
    agregar('comuna', datos.comuna ? '' : 'Debe seleccionar una comuna.')
    agregar('direccion', validarTextoObligatorio(datos.direccion, 'La dirección es obligatoria.', 300,
        'La dirección no puede superar los 300 caracteres.'))

    if (modo !== 'registro') {
        agregar('tipoUsuario', datos.tipoUsuario ? '' : 'Debe seleccionar un tipo de usuario.')
    }

    if (modo !== 'editar') {
        agregar('contrasena', validarContrasena(datos.contrasena))
        agregar('confirmarContrasena', validarConfirmacion(datos.contrasena, datos.confirmarContrasena))
    }

    // RUN y correo no se pueden repetir (al editar se ignora al propio usuario)
    const otros = usuariosExistentes.filter((usuario) => modo !== 'editar' || usuario.run !== run)

    if (!errores.correo && otros.some((usuario) => usuario.correo?.toLowerCase() === correo)) {
        errores.correo = 'Este correo ya se encuentra registrado.'
    }
    if (!errores.run && modo !== 'editar' && otros.some((usuario) => usuario.run === run)) {
        errores.run = 'Este RUN ya se encuentra registrado.'
    }

    return errores
}