// J3-07: valores oficiales del backend (Rol.java).
export const ROLES = Object.freeze({
    ADMINISTRADOR: 'ADMINISTRADOR',
    VENDEDOR: 'VENDEDOR',
    CLIENTE: 'CLIENTE',
})

export const ETIQUETA_ROL = Object.freeze({
    [ROLES.ADMINISTRADOR]: 'Administrador',
    [ROLES.VENDEDOR]: 'Vendedor',
    [ROLES.CLIENTE]: 'Cliente',
})

// Compatibilidad con las pantallas anteriores que usan tipoUsuario.
export function obtenerRol(usuario) {
    if (!usuario) return null
    if (Object.values(ROLES).includes(usuario.rol)) return usuario.rol
    return Object.keys(ETIQUETA_ROL).find(rol => ETIQUETA_ROL[rol] === usuario.tipoUsuario) ?? null
}

export function esAdministrador(usuario) {
    return obtenerRol(usuario) === ROLES.ADMINISTRADOR
}

export function esVendedor(usuario) {
    return obtenerRol(usuario) === ROLES.VENDEDOR
}

export function esPersonalInterno(usuario) {
    return esAdministrador(usuario) || esVendedor(usuario)
}
