import { useEffect, useState } from 'react' // S06
import { Routes, Route, useNavigate } from 'react-router' // S06: se agregó useNavigate

import LayoutTienda from './componentes/plantillas/LayoutTienda'
import LayoutAdmin from './componentes/plantillas/LayoutAdmin'
import RutaProtegida from './componentes/plantillas/RutaProtegida'

import {
  Catalogo,
  DetalleProducto,
  Carrito,
  Registro,
  Blogs,
  DetalleBlog,
} from './paginas/tienda/PaginasProvisionales' // S06: se quitó Login de aquí

import Inicio from './paginas/tienda/Inicio'
import Nosotros from './paginas/tienda/Nosotros'
import Contacto from './paginas/tienda/Contacto'
import NoEncontrada from './paginas/tienda/NoEncontrada'
import Login from './paginas/tienda/Login' // S06: la página real
import {
  CLAVE_USUARIOS,
  CLAVE_SESION,
  leerJSON,
  guardarJSON,
  leerUsuarios,
  buscarPorCredenciales,
  crearSesion,
} from './utils/usuarios' // S06
import {
  InicioAdmin,
  ProductosAdmin,
  NuevoProducto,
  EditarProducto,
  UsuariosAdmin,
  NuevoUsuario,
  VerUsuario,
  EditarUsuario,
} from './paginas/admin/PaginasAdminProvisionales'

function App() {
  const navegar = useNavigate()

  // S06 - ESTADO COMPARTIDO: usuarios registrados y sesión activa.
  // Se leen de localStorage al abrir la página y bajan por props a quien los necesita.
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [sesion, setSesion] = useState(() => leerJSON(CLAVE_SESION, null))

  // Cada vez que cambian, se guardan en localStorage (sobreviven a un F5)
  useEffect(() => {
    guardarJSON(CLAVE_USUARIOS, usuarios)
  }, [usuarios])

  useEffect(() => {
    if (sesion) guardarJSON(CLAVE_SESION, sesion)
    else localStorage.removeItem(CLAVE_SESION)
  }, [sesion])

  // Devuelve el usuario si el correo y la contraseña son correctos, o null si no
  function iniciarSesion(correo, contrasena) {
    const usuario = buscarPorCredenciales(usuarios, correo, contrasena)
    if (usuario) setSesion(crearSesion(usuario))
    return usuario
  }

  function cerrarSesion() {
    setSesion(null)
    navegar('/')
  }

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route
        path="/"
        element={<LayoutTienda usuario={sesion} onCerrarSesion={cerrarSesion} />}
      >
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Catalogo />} />
        <Route path="producto/:codigo" element={<DetalleProducto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login onIniciarSesion={iniciarSesion} />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* RUTAS: ADMINISTRADOR Y VENDEDOR */}
      <Route
        element={
          <RutaProtegida
            sesion={sesion}
            perfilesPermitidos={['Administrador', 'Vendedor']}
          />
        }
      >
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<InicioAdmin />} />
          <Route path="productos" element={<ProductosAdmin />} />
        </Route>
      </Route>

      {/* RUTAS: SOLO ADMINISTRADOR */}
      <Route
        element={
          <RutaProtegida
            sesion={sesion}
            perfilesPermitidos={['Administrador']}
          />
        }
      >
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route
            path="productos/nuevo"
            element={<NuevoProducto />}
          />
          <Route
            path="productos/:codigo/editar"
            element={<EditarProducto />}
          />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route
            path="usuarios/nuevo"
            element={<NuevoUsuario />}
          />
          <Route
            path="usuarios/:run"
            element={<VerUsuario />}
          />
          <Route
            path="usuarios/:run/editar"
            element={<EditarUsuario />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App