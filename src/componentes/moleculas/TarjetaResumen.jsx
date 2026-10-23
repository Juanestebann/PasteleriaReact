
import { Link } from 'react-router'

function TarjetaResumen({ titulo, descripcion, cantidad, enlace, textoEnlace }) {
    return (
        <article className="tarjeta-admin panel panel-con-borde">
            <h3>{titulo}</h3>

            {cantidad !== undefined && (
                <p className="contador-tarjeta-admin">
                    {cantidad}
                </p>
            )}

            <p>{descripcion}</p>

            {enlace && (
                <Link to={enlace}>
                    {textoEnlace}
                </Link>
            )}
        </article>
    )
}

export default TarjetaResumen
