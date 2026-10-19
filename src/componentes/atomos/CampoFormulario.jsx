// Átomo: un campo de formulario con su etiqueta y su mensaje de error.
// Reemplaza el bloque que se repetía en todos los formularios HTML:
//   <section class="campo-formulario"> <label> <input> <p class="mensaje-error"> </section>
//
// Si tipo es "select", las opciones se pasan como children.
function CampoFormulario({
    id,
    etiqueta,
    tipo = 'text',
    valor,
    onChange,
    error = '',
    placeholder,
    autoComplete,
    maxLength,
    disabled = false,
    children,
}) {
    const idError = `error-${id}`

    // Propiedades comunes para input y select
    const propiedades = {
        id,
        name: id,
        value: valor,
        onChange,
        disabled,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? idError : undefined,
    }

    return (
        <section className="campo-formulario">
            <label htmlFor={id}>{etiqueta}</label>

            {tipo === 'select' ? (
                <select {...propiedades}>{children}</select>
            ) : (
                <input
                    {...propiedades}
                    type={tipo}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                />
            )}

            {/* role="alert" hace que el lector de pantalla anuncie el error */}
            <p className="mensaje-error" id={idError} role={error ? 'alert' : undefined}>
                {error}
            </p>
        </section>
    )
}

export default CampoFormulario