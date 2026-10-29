
import { useState } from 'react'
import { productosIniciales } from '../../datos/productos'

const productoVacio = {
    codigo: '',
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: '',
    categoria: '',
    stock: '',
    stockCritico: '',
}

const categorias = [
    { valor: 'cuadradas', nombre: 'Tortas cuadradas' },
    { valor: 'circulares', nombre: 'Tortas circulares' },
    { valor: 'individuales', nombre: 'Postres individuales' },
    { valor: 'sin-azucar', nombre: 'Sin azúcar' },
    { valor: 'tradicional', nombre: 'Pastelería tradicional' },
    { valor: 'sin-gluten', nombre: 'Sin gluten' },
    { valor: 'veganos', nombre: 'Veganos' },
    { valor: 'especiales', nombre: 'Tortas especiales' },
]

export function validarProducto(
    datos,
    { modo = 'nuevo', productosExistentes = [] } = {}
) {
    const errores = {}
    const codigo = String(datos.codigo ?? '').trim().toUpperCase()
    const nombre = String(datos.nombre ?? '').trim()
    const imagen = String(datos.imagen ?? '').trim()
    const descripcion = String(datos.descripcion ?? '').trim()

    if (!codigo) {
        errores.codigo = 'El código es obligatorio.'
    } else if (
        modo === 'nuevo' &&
        productosExistentes.some(
            (producto) =>
                String(producto.codigo).toUpperCase() === codigo
        )
    ) {
        errores.codigo = 'Este código ya está registrado.'
    }

    if (!nombre) {
        errores.nombre = 'El nombre es obligatorio.'
    }

    if (
        datos.precio === '' ||
        datos.precio === null ||
        !Number.isFinite(Number(datos.precio)) ||
        Number(datos.precio) < 0
    ) {
        errores.precio = 'El precio debe ser un número no negativo.'
    }

    if (!imagen) {
        errores.imagen = 'La imagen es obligatoria.'
    }

    if (!descripcion) {
        errores.descripcion = 'La descripción es obligatoria.'
    }

    if (
        !categorias.some(
            (categoria) => categoria.valor === datos.categoria
        )
    ) {
        errores.categoria = 'Selecciona una categoría válida.'
    }

    for (const campo of ['stock', 'stockCritico']) {
        const valor = Number(datos[campo])

        if (
            datos[campo] === '' ||
            datos[campo] === null ||
            !Number.isInteger(valor) ||
            valor < 0
        ) {
            errores[campo] =
                'Debe ser un número entero mayor o igual a cero.'
        }
    }

    return errores
}

function FormularioProducto({
    modo = 'nuevo',
    productoInicial = null,
    productosExistentes = productosIniciales,
    onGuardar,
    onCancelar,
}) {
    const [datos, setDatos] = useState(() => ({
        ...productoVacio,
        ...productoInicial,
    }))

    const [errores, setErrores] = useState({})
    const esEdicion = modo === 'editar'

    function actualizarCampo(evento) {
        const { name, value } = evento.target

        setDatos((actuales) => ({
            ...actuales,
            [name]: value,
        }))

        setErrores((actuales) => ({
            ...actuales,
            [name]: '',
        }))
    }

    function enviarFormulario(evento) {
        evento.preventDefault()

        const nuevosErrores = validarProducto(datos, {
            modo,
            productosExistentes,
        })

        setErrores(nuevosErrores)

        if (Object.keys(nuevosErrores).length > 0) {
            return
        }

        const producto = {
            codigo: String(datos.codigo).trim().toUpperCase(),
            nombre: String(datos.nombre).trim(),
            precio: Number(datos.precio),
            imagen: String(datos.imagen).trim(),
            descripcion: String(datos.descripcion).trim(),
            categoria: datos.categoria,
            stock: Number(datos.stock),
            stockCritico: Number(datos.stockCritico),
        }

        onGuardar(producto)
    }

    function campo({
        nombre,
        etiqueta,
        tipo = 'text',
        placeholder = '',
        bloqueado = false,
    }) {
        return (
            <div className="campo-formulario" key={nombre}>
                <label htmlFor={nombre} className="form-label">
                    {etiqueta}
                </label>

                <input
                    id={nombre}
                    name={nombre}
                    type={tipo}
                    className="form-control"
                    value={datos[nombre]}
                    onChange={actualizarCampo}
                    placeholder={placeholder}
                    disabled={bloqueado}
                    aria-invalid={Boolean(errores[nombre])}
                    aria-describedby={
                        errores[nombre]
                            ? `${nombre}-error`
                            : undefined
                    }
                />

                {errores[nombre] && (
                    <p
                        id={`${nombre}-error`}
                        className="text-danger mt-1"
                        role="alert"
                    >
                        {errores[nombre]}
                    </p>
                )}
            </div>
        )
    }

    return (
        <form
            id={
                esEdicion
                    ? 'formulario-editar-producto'
                    : 'formulario-nuevo-producto'
            }
            className="formulario-producto"
            noValidate
            onSubmit={enviarFormulario}
        >
            <div className="editor-producto-grid">

                {/* INFORMACIÓN DEL PRODUCTO */}
                <section className="bloque-formulario">
                    <header className="titulo-bloque-formulario">
                        <span
                            className="icono-titulo-producto"
                            aria-hidden="true"
                        >
                            📦
                        </span>
                        <div>
                            <h2>Información del producto</h2>
                            <p>
                                Ingresa los datos principales del producto.
                            </p>
                        </div>
                    </header>

                    <div className="fila-formulario fila-doble">
                        {campo({
                            nombre: 'codigo',
                            etiqueta: 'Código',
                            placeholder: 'Ej: TC003',
                            bloqueado: esEdicion,
                        })}

                        {campo({
                            nombre: 'nombre',
                            etiqueta: 'Nombre',
                            placeholder: 'Nombre del producto',
                        })}
                    </div>

                    <div className="fila-formulario fila-doble">
                        {campo({
                            nombre: 'precio',
                            etiqueta: 'Precio',
                            tipo: 'number',
                            placeholder: 'Precio en pesos',
                        })}

                        <div className="campo-formulario">
                            <label
                                htmlFor="categoria"
                                className="form-label"
                            >
                                Categoría
                            </label>

                            <select
                                id="categoria"
                                name="categoria"
                                className="form-select"
                                value={datos.categoria}
                                onChange={actualizarCampo}
                                aria-invalid={Boolean(errores.categoria)}
                                aria-describedby={
                                    errores.categoria
                                        ? 'categoria-error'
                                        : undefined
                                }
                            >
                                <option value="">
                                    Selecciona una categoría
                                </option>

                                {categorias.map((categoria) => (
                                    <option
                                        key={categoria.valor}
                                        value={categoria.valor}
                                    >
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>

                            {errores.categoria && (
                                <p
                                    id="categoria-error"
                                    className="text-danger mt-1"
                                    role="alert"
                                >
                                    {errores.categoria}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* INVENTARIO */}
                <section className="bloque-formulario">
                    <header className="titulo-bloque-formulario">
                        <span
                            className="icono-titulo-producto"
                            aria-hidden="true"
                        >
                            📊
                        </span>
                        <div>
                            <h2>Inventario</h2>
                            <p>
                                Configura las existencias y el stock crítico.
                            </p>
                        </div>
                    </header>

                    <div className="fila-formulario fila-doble">
                        {campo({
                            nombre: 'stock',
                            etiqueta: 'Stock',
                            tipo: 'number',
                        })}

                        {campo({
                            nombre: 'stockCritico',
                            etiqueta: 'Stock crítico',
                            tipo: 'number',
                        })}
                    </div>
                </section>

                {/* DESCRIPCIÓN Y CATEGORÍA */}
                <section className="bloque-formulario bloque-completo">
                    <header className="titulo-bloque-formulario">
                        <span
                            className="icono-titulo-producto"
                            aria-hidden="true"
                        >
                            🧁
                        </span>
                        <div>
                            <h2>Descripción y categoría</h2>
                            <p>
                                Define cómo se presenta el producto.
                            </p>
                        </div>
                    </header>

                    {campo({
                        nombre: 'imagen',
                        etiqueta: 'Imagen',
                        placeholder: '/img/Nombre del producto.png',
                    })}

                    <div className="campo-formulario">
                        <label
                            htmlFor="descripcion"
                            className="form-label"
                        >
                            Descripción
                        </label>

                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="form-control"
                            rows={4}
                            value={datos.descripcion}
                            onChange={actualizarCampo}
                            aria-invalid={Boolean(errores.descripcion)}
                            aria-describedby={
                                errores.descripcion
                                    ? 'descripcion-error'
                                    : undefined
                            }
                        />

                        {errores.descripcion && (
                            <p
                                id="descripcion-error"
                                className="text-danger mt-1"
                                role="alert"
                            >
                                {errores.descripcion}
                            </p>
                        )}
                    </div>
                </section>

                {/* ACCIONES */}
                <div className="acciones-formulario-producto">
                    <button
                        type="submit"
                        className="btn btn-guardar-producto"
                    >
                        {esEdicion
                            ? 'Guardar cambios'
                            : 'Crear producto'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-cancelar-producto"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormularioProducto
