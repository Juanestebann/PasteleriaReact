
import { Routes, Route } from 'react-router'
import LayoutTienda from './componentes/plantillas/LayoutTienda'
import LayoutAdmin from './componentes/plantillas/LayoutAdmin'
import RutaProtegida from './componentes/plantillas/RutaProtegida'

import {
  Inicio,
  Catalogo,
  DetalleProducto,
  Carrito,
  Login,
  Registro,
  Nosotros,
  Blogs,
  DetalleBlog,
  Contacto,
  NoEncontrada,
} from './paginas/tienda/PaginasProvisionales'

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
  // Sesión temporal utilizada únicamente para probar las rutas
  const sesionPrueba = {
    rol: 'null'
  }

  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<LayoutTienda />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Catalogo />} />
        <Route path="producto/:codigo" element={<DetalleProducto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
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
            sesion={sesionPrueba}
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
            sesion={sesionPrueba}
            perfilesPermitidos={['Administrador']}
          />
        }
      >
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="productos/nuevo" element={<NuevoProducto />} />
          <Route path="productos/:codigo/editar" element={<EditarProducto />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
          <Route path="usuarios/:run" element={<VerUsuario />} />
          <Route path="usuarios/:run/editar" element={<EditarUsuario />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
