// Átomo: controla el scroll al cambiar de ruta.
// En la Ev1 cada link cargaba un HTML nuevo (que siempre parte arriba) y los links con #
// (como "Promociones" → index.html#promocion) bajaban solos a esa sección.
// En React la página no se recarga, así que hay que hacer las dos cosas a mano.
import { useEffect } from 'react'
import { useLocation } from 'react-router'

function SubirAlInicio() {
    const { pathname, hash, key } = useLocation()

    // 1. Página nueva sin # → partir desde arriba
    useEffect(() => {
        if (hash) return
        // 'instant': Bootstrap activa el scroll suave en toda la página; aquí queremos saltar directo arriba
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [pathname, hash])

    // 2. Link con # (ej: /#promocion) → bajar suave a esa sección.
    //    Depende de "key" para que funcione aunque se aprete dos veces el mismo link.
    useEffect(() => {
        if (!hash) return
        // Se espera un instante para que la página termine de dibujarse
        const temporizador = setTimeout(() => {
            const seccion = document.getElementById(decodeURIComponent(hash.slice(1)))
            if (seccion && typeof seccion.scrollIntoView === 'function') {
                seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 60)
        return () => clearTimeout(temporizador)
    }, [hash, key])

    // No dibuja nada; solo ejecuta los efectos
    return null
}

export default SubirAlInicio