import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from './api'
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    usuarioParaApi,
} from './usuarios'

// Se reemplaza la instancia de axios: las pruebas no llaman a la API real
vi.mock('./api', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }))

const vendedorApi = {
    run: '222222222', nombre: 'Vendedor', apellidos: 'Mil Sabores', correo: 'vendedor@gmail.com',
    fechaNacimiento: null, region: 'Región del Biobío', comuna: 'Concepción', direccion: 'Av. San Martín 1234',
    rol: 'VENDEDOR',
}

describe('S3-10 - servicio usuarios.js', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('listarUsuarios hace GET /usuarios y traduce el rol para las pantallas', async () => {
        api.get.mockResolvedValue({ data: [vendedorApi] })

        const lista = await listarUsuarios()

        expect(api.get).toHaveBeenCalledWith('/usuarios')
        expect(lista[0].tipoUsuario).toBe('Vendedor')
        expect(lista[0].fechaNacimiento).toBe('')
    })

    it('obtenerUsuario hace GET /usuarios/{run}', async () => {
        api.get.mockResolvedValue({ data: vendedorApi })

        const usuario = await obtenerUsuario('222222222')

        expect(api.get).toHaveBeenCalledWith('/usuarios/222222222')
        expect(usuario.nombre).toBe('Vendedor')
    })

    it('usuarioParaApi envía el rol en mayúsculas, la fecha vacía como null y sin tipoUsuario', () => {
        const datos = usuarioParaApi({ ...vendedorApi, fechaNacimiento: '', tipoUsuario: 'Administrador', contrasena: 'clave1' })

        expect(datos.rol).toBe('ADMINISTRADOR')
        expect(datos.fechaNacimiento).toBeNull()
        expect(datos.contrasena).toBe('clave1')
        expect(datos).not.toHaveProperty('tipoUsuario')
    })

    it('crear, actualizar y eliminar usan POST, PUT y DELETE con el RUN en la ruta', async () => {
        api.post.mockResolvedValue({ data: vendedorApi })
        api.put.mockResolvedValue({ data: vendedorApi })
        api.delete.mockResolvedValue({})
        const usuario = { ...vendedorApi, tipoUsuario: 'Vendedor' }

        await crearUsuario(usuario)
        await actualizarUsuario('222222222', usuario)
        await eliminarUsuario('222222222')

        expect(api.post).toHaveBeenCalledWith('/usuarios', expect.objectContaining({ rol: 'VENDEDOR' }))
        expect(api.put).toHaveBeenCalledWith('/usuarios/222222222', expect.objectContaining({ rol: 'VENDEDOR' }))
        expect(api.delete).toHaveBeenCalledWith('/usuarios/222222222')
    })
})