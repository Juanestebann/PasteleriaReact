export const monedaOrden = (valor) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
        .format(Number(valor) || 0)

export const fechaOrden = (valor) => {
    if (!valor) return 'Sin fecha'
    // LocalDateTime de Java no tiene zona horaria; mostrar la hora registrada sin convertirla a UTC.
    const fecha = new Date(valor)
    return Number.isNaN(fecha.getTime()) ? 'Sin fecha' : new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium', timeStyle: 'short'
    }).format(fecha)
}

export const unidadesOrden = (boleta) =>
    (Array.isArray(boleta?.detalle) ? boleta.detalle : [])
        .reduce((suma, linea) => suma + (Number(linea.cantidad) || 0), 0)

export const mensajeErrorBoleta = (error, alternativo) => {
    const estado = error?.response?.status
    if (estado === 403) return 'No tienes permiso para consultar estas órdenes.'
    if (estado === 404) return 'No se encontró la orden solicitada.'
    if (!error?.response) return 'No se pudo conectar con el servidor. Comprueba que la API esté funcionando.'
    return error?.response?.data?.mensaje || alternativo
}
