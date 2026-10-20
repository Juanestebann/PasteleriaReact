// Molécula: los dos selects dependientes de región y comuna.
// Antes cargarRegiones() y cargarComunas() estaban copiadas en 3 archivos JS.
// Ahora la lista viene de datos/ubicaciones.js y este componente se reutiliza
// en el registro y en el administrador de usuarios.
import CampoFormulario from '../atomos/CampoFormulario'
import { regiones, obtenerComunas } from '../../datos/ubicaciones'

function SelectorRegionComuna({ region, comuna, onCambiar, errores = {}, modificados = {} }) {
    // Las comunas se calculan a partir de la región elegida
    const comunas = obtenerComunas(region)

    function cambiarRegion(evento) {
        onCambiar('region', evento.target.value)
        // Al cambiar de región, la comuna anterior ya no sirve
        onCambiar('comuna', '')
    }

    return (
        <section className="fila-formulario">
            <CampoFormulario
                id="region"
                etiqueta="Región"
                tipo="select"
                valor={region}
                onChange={cambiarRegion}
                error={errores.region}
                modificado={modificados.region}
            >
                <option value="">Seleccione una región</option>
                {regiones.map((r) => (
                    <option key={r.nombre} value={r.nombre}>
                        {r.nombre}
                    </option>
                ))}
            </CampoFormulario>

            <CampoFormulario
                id="comuna"
                etiqueta="Comuna"
                tipo="select"
                valor={comuna}
                onChange={(evento) => onCambiar('comuna', evento.target.value)}
                error={errores.comuna}
                modificado={modificados.comuna}
            >
                <option value="">Seleccione una comuna</option>
                {comunas.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </CampoFormulario>
        </section>
    )
}

export default SelectorRegionComuna