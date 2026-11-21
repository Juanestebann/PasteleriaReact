
import axios from 'axios'
import { leerSesion, guardarSesion, borrarSesion } from './sesion'

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
})

let promesaRenovacion = null

api.interceptors.request.use((config) => {
    const sesion = leerSesion()

    if (sesion?.accessToken && !config._reintentado) {
        config.headers.set('Authorization', `Bearer ${sesion.accessToken}`)
    }

    return config
})

api.interceptors.response.use(
    (respuesta) => respuesta,
    async (error) => {
        const peticionOriginal = error.config
        const ruta = peticionOriginal?.url || ''

        const esLoginORefresh = /\/auth\/(login|refresh)(?:[/?#]|$)/.test(ruta)

        if (
            error.response?.status !== 401 ||
            !peticionOriginal ||
            peticionOriginal._reintentado ||
            esLoginORefresh
        ) {
            return Promise.reject(error)
        }

        peticionOriginal._reintentado = true

        const sesion = leerSesion()

        if (!sesion?.refreshToken) {
            borrarSesion()
            window.dispatchEvent(new Event('sesion-expirada'))
            return Promise.reject(error)
        }

        if (!promesaRenovacion) {
            const renovacion = axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { refreshToken: sesion.refreshToken }
            ).then(({ data }) => {
                const sesionActual = leerSesion()

                if (sesionActual?.refreshToken !== sesion.refreshToken) {
                    throw new Error('La sesión cambió durante la renovación')
                }

                const nuevaSesion = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken || sesion.refreshToken,
                    usuario: data.usuario || sesion.usuario
                }

                guardarSesion(nuevaSesion)
                return nuevaSesion.accessToken
            })

            promesaRenovacion = renovacion.finally(() => {
                promesaRenovacion = null
            })
        }

        try {
            const nuevoToken = await promesaRenovacion

            peticionOriginal.headers.set(
                'Authorization',
                `Bearer ${nuevoToken}`
            )

            return api(peticionOriginal)
        } catch (errorRenovacion) {
            if (leerSesion()?.refreshToken === sesion.refreshToken) {
                borrarSesion()
                window.dispatchEvent(new Event('sesion-expirada'))
            }

            return Promise.reject(errorRenovacion)
        }
    }
)

export default api
