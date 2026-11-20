import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Login from './Login'
import { login } from '../../servicios/auth'

// S3-09: el login ahora llama a la API. Se simula el servicio para no depender del backend.
vi.mock('../../servicios/auth', () => ({ login: vi.fn() }))

// Respuesta de la API con el rol indicado
function respuestaApi(rol) {
    return { accessToken: 'token', refreshToken: 'refresh', usuario: { nombre: 'Prueba', rol } }
}

// Dibuja Login dentro de un router de prueba, con las páginas de destino
function renderizarLogin(onIniciarSesion = vi.fn()) {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<Login onIniciarSesion={onIniciarSesion} />} />
                <Route path="/admin" element={<h1>Panel de administración</h1>} />
                <Route path="/admin/productos" element={<h1>Productos del panel</h1>} />
                <Route path="/" element={<h1>Inicio de la tienda</h1>} />
            </Routes>
        </MemoryRouter>
    )
}

// Escribe el correo y la contraseña y presiona el botón
async function ingresar(usuario, correo, contrasena) {
    await usuario.type(screen.getByLabelText('Correo electrónico'), correo)
    await usuario.type(screen.getByLabelText('Contraseña'), contrasena)
    await usuario.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('S3-09 - Página Login conectada a la API', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('un Administrador entra al panel y App recibe la respuesta de la API', async () => {
        const usuario = userEvent.setup()
        const onIniciarSesion = vi.fn()
        login.mockResolvedValue(respuestaApi('ADMINISTRADOR'))

        renderizarLogin(onIniciarSesion)
        await ingresar(usuario, 'admin@gmail.com', 'admin123')

        expect(login).toHaveBeenCalledWith('admin@gmail.com', 'admin123')
        expect(onIniciarSesion).toHaveBeenCalledWith(respuestaApi('ADMINISTRADOR'))
        expect(await screen.findByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument()
    })

    it('un Vendedor va directo a los productos del panel', async () => {
        const usuario = userEvent.setup()
        login.mockResolvedValue(respuestaApi('VENDEDOR'))

        renderizarLogin()
        await ingresar(usuario, 'vendedor@gmail.com', 'vend123')

        expect(await screen.findByRole('heading', { name: 'Productos del panel' })).toBeInTheDocument()
    })

    it('un Cliente vuelve al inicio de la tienda', async () => {
        const usuario = userEvent.setup()
        login.mockResolvedValue(respuestaApi('CLIENTE'))

        renderizarLogin()
        await ingresar(usuario, 'cliente@gmail.com', 'cliente123')

        expect(await screen.findByRole('heading', { name: 'Inicio de la tienda' })).toBeInTheDocument()
    })

    it('con un 401 muestra que las credenciales no son correctas y no inicia sesión', async () => {
        const usuario = userEvent.setup()
        const onIniciarSesion = vi.fn()
        login.mockRejectedValue({ response: { status: 401, data: { mensaje: 'Correo o contraseña incorrectos' } } })

        renderizarLogin(onIniciarSesion)
        await ingresar(usuario, 'admin@gmail.com', 'mala123')

        expect(await screen.findByRole('alert')).toHaveTextContent('El email o la contraseña no son correctos.')
        expect(onIniciarSesion).not.toHaveBeenCalled()
    })

    it('si la API está apagada avisa que no hay conexión', async () => {
        const usuario = userEvent.setup()
        login.mockRejectedValue({ request: {} })

        renderizarLogin()
        await ingresar(usuario, 'admin@gmail.com', 'admin123')

        expect(await screen.findByRole('alert')).toHaveTextContent('No hay conexión con el servidor')
    })
})