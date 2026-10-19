// Cuentas internas de demostración (las mismas de login.js en la versión HTML).
// Ojo: es solo para la demo. Guardar contraseñas en el navegador no es seguro;
// en un sistema real la autenticación la hace el backend.
//
// Ahora tienen RUN válido, porque en React cada usuario se identifica por su RUN
// en la URL (/admin/usuarios/:run). Antes aparecía "-" en la tabla del admin.

const usuariosIniciales = [
    {
        run: '111111111',
        nombre: 'Administrador',
        apellidos: 'Mil Sabores',
        correo: 'admin@gmail.com',
        fechaNacimiento: '',
        region: 'Región del Biobío',
        comuna: 'Concepción',
        direccion: 'Av. San Martín 1234',
        contrasena: 'admin123',
        tipoUsuario: 'Administrador',
    },
    {
        run: '222222222',
        nombre: 'Vendedor',
        apellidos: 'Mil Sabores',
        correo: 'vendedor@gmail.com',
        fechaNacimiento: '',
        region: 'Región del Biobío',
        comuna: 'Concepción',
        direccion: 'Av. San Martín 1234',
        contrasena: 'vend123',
        tipoUsuario: 'Vendedor',
    },
]

export default usuariosIniciales