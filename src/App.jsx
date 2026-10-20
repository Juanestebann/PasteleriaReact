
import { useEffect, useState } from 'react' // S06
import { Routes, Route, useNavigate } from 'react-router' // S06: se agregó useNavigate
import DetalleProducto from './paginas/tienda/DetalleProducto'
import LayoutTienda from './componentes/plantillas/LayoutTienda'
import LayoutAdmin from './componentes/plantillas/LayoutAdmin'
import RutaProtegida from './componentes/plantillas/RutaProtegida'
import {
  Blogs,
  DetalleBlog,
} from './paginas/tienda/PaginasProvisionales' // S06: se quitó Login · S08: se quitó Registro
import Carrito from './paginas/tienda/Carrito'
import Inicio from './paginas/tienda/Inicio'
import Catalogo from './paginas/tienda/Catalogo'
import Nosotros from './paginas/tienda/Nosotros'
import Contacto from './paginas/tienda/Contacto'
import NoEncontrada from './paginas/tienda/NoEncontrada'
import Login from './paginas/tienda/Login' // S06: la página real
import Registro from './paginas/tienda/Registro' // S08: la página real
import UsuariosAdmin from './paginas/admin/UsuariosAdmin' // S10: la página real
import EditorUsuario from './paginas/admin/EditorUsuario' // S11: nuevo y editar usuario
import VerUsuario from './paginas/admin/VerUsuario' // S12: detalle del usuario
import ProductosAdmin from './paginas/admin/ProductosAdmin'
import EditorProducto from './paginas/admin/EditorProducto'
import {
  leerProductos,
  guardarProductos,
  crearProducto,
  actualizarProducto,
} from './utils/productos'
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
} from './paginas/admin/PaginasAdminProvisionales' // S10: se quitó UsuariosAdmin · S11: NuevoUsuario y EditarUsuario · S12: VerUsuario

function App() {
  const navegar = useNavigate()

  // S06 - ESTADO COMPARTIDO: usuarios registrados y sesión activa.
  // Se leen de localStorage al abrir la página y bajan por props a quien los necesita.
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [sesion, setSesion] = useState(() => leerJSON(CLAVE_SESION, null))
  const [productos, setProductos] = useState(leerProductos)

  // Cada vez que cambian, se guardan en localStorage (sobreviven a un F5)
  useEffect(() => {
    guardarJSON(CLAVE_USUARIOS, usuarios)
  }, [usuarios])

  useEffect(() => {
    if (sesion) guardarJSON(CLAVE_SESION, sesion)
    else localStorage.removeItem(CLAVE_SESION)
  }, [sesion])

  useEffect(() => {
    guardarProductos(productos)
  }, [productos])

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

  // S08: el registro agrega al cliente a la lista y deja su sesión iniciada (igual que la Ev1)
  function registrarUsuario(usuario) {
    setUsuarios((actuales) => [...actuales, usuario])
    setSesion(crearSesion(usuario))
  }

  // S11: el administrador crea un usuario (a diferencia del registro, no cambia la sesión)
  function crearUsuario(usuario) {
    setUsuarios((actuales) => [...actuales, usuario])
  }

  // S11: reemplaza al usuario que tiene el mismo RUN por su versión editada
  function actualizarUsuario(usuarioEditado) {
    setUsuarios((actuales) =>
      actuales.map((usuario) => (usuario.run === usuarioEditado.run ? usuarioEditado : usuario))
    )
    // Si el administrador se editó a sí mismo, también se actualiza su sesión
    if (sesion?.run === usuarioEditado.run) setSesion(crearSesion(usuarioEditado))
  }

  function crearNuevoProducto(producto) {
    setProductos((actuales) => crearProducto(actuales, producto))
  }

  function guardarProductoEditado(producto) {
    setProductos((actuales) => actualizarProducto(actuales, producto))
  }

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route
        path="/"
        element={<LayoutTienda usuario={sesion} onCerrarSesion={cerrarSesion} />}
      >
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Catalogo productos={productos} />} />
        <Route path="producto/:codigo" element={<DetalleProducto productos={productos} />} />
        <Route path="carrito" element={<Carrito productos={productos} />} />
        <Route path="login" element={<Login onIniciarSesion={iniciarSesion} />} />
        {/* S08 */}
        <Route
          path="registro"
          element={<Registro usuarios={usuarios} onRegistrar={registrarUsuario} />}
        />
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
          <Route
            path="productos"
            element={
              <ProductosAdmin
                productos={productos}
                puedeGestionar={sesion?.tipoUsuario === 'Administrador'}
              />
            }
          />
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
            element={
              <EditorProducto
                productos={productos}
                onCrear={crearNuevoProducto}
                onActualizar={guardarProductoEditado}
              />
            }
          />
          <Route
            path="productos/:codigo/editar"
            element={
              <EditorProducto
                productos={productos}
                onCrear={crearNuevoProducto}
                onActualizar={guardarProductoEditado}
              />
            }
          />
          {/* S10 */}
          <Route path="usuarios" element={<UsuariosAdmin usuarios={usuarios} />} />
          {/* S11 */}
          <Route
            path="usuarios/nuevo"
            element={<EditorUsuario usuarios={usuarios} onCrear={crearUsuario} />}
          />
          {/* S12 */}
          <Route path="usuarios/:run" element={<VerUsuario usuarios={usuarios} />} />
          <Route
            path="usuarios/:run/editar"
            element={<EditorUsuario usuarios={usuarios} onActualizar={actualizarUsuario} />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
