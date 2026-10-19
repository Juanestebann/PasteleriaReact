// Organismo: formulario de usuario reutilizable en tres modos.
//   'registro' → página pública de registro (crea un Cliente)
//   'nuevo'    → administrador crea un usuario y elige su tipo
//   'editar'   → administrador edita: el RUN queda bloqueado y no se pide contraseña
//
// En la versión HTML esto eran 3 archivos (registro.js, nuevo-usuario.js y editar-usuario.js)
// con ~3.000 líneas que repetían las mismas validaciones y la lista de regiones.
import { useState } from 'react'
import CampoFormulario from '../atomos/CampoFormulario'
import SelectorRegionComuna from '../moleculas/SelectorRegionComuna'
import { validarUsuario } from '../../utils/validaciones'

const TIPOS_USUARIO = ['Administrador', 'Cliente', 'Vendedor']

const usuarioVacio = {
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    contrasena: '',
    confirmarContrasena: '',
    tipoUsuario: '',
}

// Cada modo conserva el id y la clase que espera el CSS migrado
const configuracionPorModo = {
    registro: { idFormulario: 'formulario-registro', clase: 'formulario-acceso' },
    nuevo: { idFormulario: 'formulario-nuevo-usuario', clase: 'formulario-usuario' },
    editar: { idFormulario: 'formulario-editar-usuario', clase: 'formulario-usuario' },
}

function FormularioUsuario({
    modo = 'registro',
    usuarioInicial = null,
    usuariosExistentes = [],
    onGuardar,
    onCancelar,
    textoBoton = 'Crear cuenta',
    mensajeExito = '',
}) {
    const [datos, setDatos] = useState({ ...usuarioVacio, ...usuarioInicial, confirmarContrasena: '' })
    const [errores, setErrores] = useState({})
    const [guardado, setGuardado] = useState(false)

    const { idFormulario, clase } = configuracionPorModo[modo]
    const esAdmin = modo !== 'registro'
    const pideContrasena = modo !== 'editar'

    // Actualiza un campo por su nombre y borra su error
    function cambiarValor(campo, valor) {
        setDatos((actual) => ({ ...actual, [campo]: valor }))
        setErrores((actual) => ({ ...actual, [campo]: '' }))
        setGuardado(false)
    }

    function actualizarCampo(evento) {
        cambiarValor(evento.target.name, evento.target.value)
    }

    function enviarFormulario(evento) {
        evento.preventDefault()

        const nuevosErrores = validarUsuario(datos, { modo, usuariosExistentes })
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length > 0) return

        // Se arma el usuario limpio que se entrega hacia arriba (sin la confirmación)
        const { confirmarContrasena: _confirmacion, ...resto } = datos
        const usuario = {
            ...resto,
            run: datos.run.trim().toUpperCase(),
            nombre: datos.nombre.trim(),
            apellidos: datos.apellidos.trim(),
            correo: datos.correo.trim().toLowerCase(),
            direccion: datos.direccion.trim(),
            tipoUsuario: esAdmin ? datos.tipoUsuario : 'Cliente',
        }

        onGuardar(usuario)
        setGuardado(true)
    }

    // ---------- Campos que cambian de lugar según el modo ----------

    const campoRun = (
        <CampoFormulario
            id="run"
            etiqueta="RUN"
            valor={datos.run}
            onChange={actualizarCampo}
            error={errores.run}
            placeholder="Ej: 19011022K"
            maxLength={9}
            disabled={modo === 'editar'}
        />
    )

    const campoNombre = (
        <CampoFormulario
            id="nombre"
            etiqueta="Nombre"
            valor={datos.nombre}
            onChange={actualizarCampo}
            error={errores.nombre}
            placeholder="Tu nombre"
            autoComplete="given-name"
            maxLength={50}
        />
    )

    const campoApellidos = (
        <CampoFormulario
            id="apellidos"
            etiqueta="Apellidos"
            valor={datos.apellidos}
            onChange={actualizarCampo}
            error={errores.apellidos}
            placeholder="Tus apellidos"
            autoComplete="family-name"
            maxLength={100}
        />
    )

    const campoTipoUsuario = (
        <CampoFormulario
            id="tipoUsuario"
            etiqueta="Rol"
            tipo="select"
            valor={datos.tipoUsuario}
            onChange={actualizarCampo}
            error={errores.tipoUsuario}
        >
            <option value="">Seleccione un rol</option>
            {TIPOS_USUARIO.map((tipo) => (
                <option key={tipo} value={tipo}>
                    {tipo}
                </option>
            ))}
        </CampoFormulario>
    )

    return (
        <form id={idFormulario} className={clase} noValidate onSubmit={enviarFormulario}>
            {/* Registro: RUN + Nombre / Apellidos. Admin: RUN + Rol / Nombre + Apellidos */}
            {esAdmin ? (
                <>
                    <section className="fila-formulario">
                        {campoRun}
                        {campoTipoUsuario}
                    </section>
                    <section className="fila-formulario">
                        {campoNombre}
                        {campoApellidos}
                    </section>
                </>
            ) : (
                <>
                    <section className="fila-formulario">
                        {campoRun}
                        {campoNombre}
                    </section>
                    {campoApellidos}
                </>
            )}

            <section className="fila-formulario">
                <CampoFormulario
                    id="correo"
                    etiqueta="Correo electrónico"
                    tipo="email"
                    valor={datos.correo}
                    onChange={actualizarCampo}
                    error={errores.correo}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    maxLength={100}
                />
                <CampoFormulario
                    id="fechaNacimiento"
                    etiqueta="Fecha de nacimiento"
                    tipo="date"
                    valor={datos.fechaNacimiento}
                    onChange={actualizarCampo}
                    error={errores.fechaNacimiento}
                />
            </section>

            <SelectorRegionComuna
                region={datos.region}
                comuna={datos.comuna}
                onCambiar={cambiarValor}
                errores={errores}
            />

            <CampoFormulario
                id="direccion"
                etiqueta="Dirección"
                valor={datos.direccion}
                onChange={actualizarCampo}
                error={errores.direccion}
                placeholder="Ej: Av. Los Carrera 123"
                autoComplete="street-address"
                maxLength={300}
            />

            {pideContrasena && (
                <section className="fila-formulario">
                    <CampoFormulario
                        id="contrasena"
                        etiqueta="Contraseña"
                        tipo="password"
                        valor={datos.contrasena}
                        onChange={actualizarCampo}
                        error={errores.contrasena}
                        placeholder="Crea una contraseña"
                        autoComplete="new-password"
                    />
                    <CampoFormulario
                        id="confirmarContrasena"
                        etiqueta="Confirmar contraseña"
                        tipo="password"
                        valor={datos.confirmarContrasena}
                        onChange={actualizarCampo}
                        error={errores.confirmarContrasena}
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                    />
                </section>
            )}

            {esAdmin ? (
                <>
                    <p className="mensaje-exito mensaje-exito-formulario" role="status">
                        {guardado ? mensajeExito : ''}
                    </p>
                    <section className="acciones-formulario-usuario">
                        <button
                            id="boton-cancelar"
                            type="button"
                            className="btn btn-admin btn-secundario"
                            onClick={onCancelar}
                        >
                            Cancelar
                        </button>
                        <button id="boton-guardar" type="submit" className="btn btn-admin btn-principal">
                            {textoBoton}
                        </button>
                    </section>
                </>
            ) : (
                <>
                    <button id="boton-registro" type="submit" className="btn btn-principal btn-acceso">
                        {textoBoton}
                    </button>
                    <p id="mensaje-registro" className="mensaje-exito" role="status">
                        {guardado ? mensajeExito : ''}
                    </p>
                </>
            )}
        </form>
    )
}

export default FormularioUsuario