
import api from './api'

export async function probarConexion() {
    try {
        const respuesta = await api.get('/productos')
        console.log('Conexión exitosa:', respuesta.data)
    } catch (error) {
        console.error('Error al conectar con el backend:', error)
    }
}
