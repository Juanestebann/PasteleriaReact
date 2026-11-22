
import { useEffect, useRef, useState } from 'react' // S06 / J3-05
import { Routes, Route, useNavigate } from 'react-router' // S06: se agregó useNavigate
import DetalleProducto from './paginas/tienda/DetalleProducto'
import { leerCarrito, EVENTO_CARRITO_ACTUALIZADO } from './utils/almacenamiento'
import { contarProductos } from './utils/carrito'
import LayoutTienda from './componentes/plantillas/LayoutTienda'
import LayoutAdmin from './componentes/plantillas/LayoutAdmin'
import RutaProtegida from './componentes/plantillas/RutaProtegida'
import Blogs from './paginas/tienda/Blogs'
import DetalleBlog from './paginas/tienda/DetalleBlog'
import SubirAlInicio from './componentes/atomos/SubirAlInicio'
import Carrito from './paginas/tienda/Carrito'
import Inicio from './paginas/tienda/Inicio'
import Catalogo from './paginas/tienda/Catalogo'
import Nosotros from './paginas/tienda/Nosotros'
import Contacto from './paginas/tienda/Contacto'
import NoEncontrada from './paginas/tienda/NoEncontrada'
import AccesoDenegado from './paginas/tienda/AccesoDenegado'
import Login from './paginas/tienda/Login'
import Registro from './paginas/tienda/Registro'
import UsuariosAdmin from './paginas/admin/UsuariosAdmin'
import EditorUsuario from './paginas/admin/EditorUsuario'
import VerUsuario from './paginas/admin/VerUsuario'
import ProductosAdmin from './paginas/admin/ProductosAdmin'
import OrdenesAdmin from './paginas/admin/OrdenesAdmin'
import DetalleOrden from './paginas/admin/DetalleOrden'
import MisCompras from './paginas/tienda/MisCompras'
import DetalleCompra from './paginas/tienda/DetalleCompra'
import EditorProducto from './paginas/admin/EditorProducto'
import { leerProductos, guardarProductos } from './utils/productos'
import { crearSesionDesdeApi } from './utils/usuarios'
import InicioAdmin from './paginas/admin/InicioAdmin'
import { obtenerProductos } from './servicios/productosApi'
import { obtenerUsuarioActual, refrescar } from './servicios/auth'
import {
  CLAVE_SESION_JWT,
  leerSesion,
  guardarSesion,
  borrarSesion,
  tokenVencido
} from './servicios/sesion'

// C3-07: evento compartido para actualizar el inventario
// después de una operación administrativa realizada correctamente.
const EVENTO_INVENTARIO_ACTUALIZADO = 'inventario-productos-actualizado'

function App() {
  const navegar = useNavigate()

  // S06 - ESTADO COMPARTIDO: sesión activa.
  // S3-10: los usuarios ya no viven aquí: las páginas del panel los piden a la API.
  const [sesion, setSesion] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)
  const [avisoSesion, setAvisoSesion] = useState('')
  const versionSesion = useRef(0)
  const [productos, setProductos] = useState(leerProductos)

  // J04: contador compartido con el carrito real (incluye las cantidades).
  const [cantidadCarrito, setCantidadCarrito] = useState(
      () => contarProductos(leerCarrito())
  )

  useEffect(() => {
    const actualizarContador = () =>
        setCantidadCarrito(contarProductos(leerCarrito()))

    // Evento propio: cambios en la misma pestaña; storage: otras pestañas.
    window.addEventListener(
        EVENTO_CARRITO_ACTUALIZADO,
        actualizarContador
    )
    window.addEventListener('storage', actualizarContador)

    return () => {
      window.removeEventListener(
          EVENTO_CARRITO_ACTUALIZADO,
          actualizarContador
      )
      window.removeEventListener('storage', actualizarContador)
    }
  }, [])

  // C3-06: carga los productos reales desde Spring Boot.
  // C3-07: vuelve a consultar el inventario cuando una operación
  // administrativa crea, edita o elimina un producto.
  useEffect(() => {
    let activo = true
    let versionInventario = 0

    async function cargarProductos() {
      const versionActual = ++versionInventario

      try {
        const productosApi = await obtenerProductos()

        if (
            activo &&
            versionActual === versionInventario &&
            Array.isArray(productosApi)
        ) {
          setProductos(productosApi)
        }
      } catch (error) {
        console.error(
            'No se pudieron cargar los productos:',
            error
        )
      }
    }

    cargarProductos()

    window.addEventListener(
        EVENTO_INVENTARIO_ACTUALIZADO,
        cargarProductos
    )

    return () => {
      activo = false
      ++versionInventario

      window.removeEventListener(
          EVENTO_INVENTARIO_ACTUALIZADO,
          cargarProductos
      )
    }
  }, [])

  // Conserva el almacenamiento compartido que ya utiliza el proyecto.
  useEffect(() => {
    guardarProductos(productos)
  }, [productos])

  // J3-05: reconstruye el usuario visible usando la identidad confirmada por /auth/me.
  // Nunca se toma el rol guardado en localStorage como autorización definitiva.
  function usuarioVisible(usuario, tokens) {
    return crearSesionDesdeApi({ ...tokens, usuario })
  }

  useEffect(() => {
    let activo = true

    async function restaurarSesion() {
      const version = ++versionSesion.current
      const guardada = leerSesion()

      if (!guardada?.accessToken || !guardada?.refreshToken) {
        if (activo && version === versionSesion.current) {
          borrarSesion()
          setSesion(null)
          setCargandoSesion(false)
        }
        return
      }

      try {
        let tokens = guardada

        if (tokenVencido(tokens.accessToken)) {
          const respuesta = await refrescar(tokens.refreshToken)

          if (!respuesta?.accessToken) {
            throw new Error('Respuesta de renovación inválida')
          }

          tokens = {
            accessToken: respuesta.accessToken,
            refreshToken:
                respuesta.refreshToken || tokens.refreshToken,
            usuario: respuesta.usuario || tokens.usuario,
          }
        }

        // El interceptor también puede renovar el token cuando /auth/me devuelve 401.
        const usuario = await obtenerUsuarioActual(tokens.accessToken)

        if (!activo || version !== versionSesion.current) return

        const actual = leerSesion()

        // No revivir una sesión cerrada mientras se estaba consultando la API.
        if (
            actual &&
            actual.refreshToken !== guardada.refreshToken &&
            actual.refreshToken !== tokens.refreshToken
        ) {
          return
        }

        if (!actual && !tokenVencido(guardada.accessToken)) return

        const confirmada = leerSesion()

        const definitiva =
            confirmada?.accessToken &&
            confirmada.refreshToken === tokens.refreshToken
                ? confirmada
                : tokens

        guardarSesion({ ...definitiva, usuario })
        setSesion(usuarioVisible(usuario, definitiva))
        setAvisoSesion('')
      } catch {
        if (activo && version === versionSesion.current) {
          borrarSesion()
          setSesion(null)
          setAvisoSesion('Tu sesión expiró')
        }
      } finally {
        if (activo && version === versionSesion.current) {
          setCargandoSesion(false)
        }
      }
    }

    restaurarSesion()

    return () => {
      activo = false
      ++versionSesion.current
    }
  }, [])

  useEffect(() => {
    function sincronizarSesion(evento) {
      if (
          evento.key !== CLAVE_SESION_JWT &&
          evento.key !== null
      ) {
        return
      }

      ++versionSesion.current

      const guardada = leerSesion()

      if (!guardada?.accessToken) {
        setSesion(null)
        setCargandoSesion(false)
        navegar('/', { replace: true })
      } else {
        // Una nueva sesión en otra pestaña se validará al recargar.
        setSesion(null)
        setCargandoSesion(true)
        window.location.reload()
      }
    }

    function sesionExpirada() {
      ++versionSesion.current
      borrarSesion()
      setSesion(null)
      setCargandoSesion(false)
      setAvisoSesion('Tu sesión expiró')
      navegar('/login', { replace: true })
    }

    window.addEventListener('storage', sincronizarSesion)
    window.addEventListener('sesion-expirada', sesionExpirada)

    return () => {
      window.removeEventListener('storage', sincronizarSesion)
      window.removeEventListener(
          'sesion-expirada',
          sesionExpirada
      )
    }
  }, [navegar])

  // S3-09: guardar tokens en la clave única que utilizan los interceptores.
  function iniciarSesion(respuestaAuth) {
    if (
        !respuestaAuth?.accessToken ||
        !respuestaAuth?.refreshToken ||
        !respuestaAuth?.usuario
    ) {
      throw new Error(
          'La respuesta de autenticación está incompleta'
      )
    }

    ++versionSesion.current
    guardarSesion(respuestaAuth)

    const nuevaSesion = usuarioVisible(
        respuestaAuth.usuario,
        respuestaAuth
    )

    setSesion(nuevaSesion)
    setAvisoSesion('')
    setCargandoSesion(false)

    return nuevaSesion
  }

  function cerrarSesion() {
    ++versionSesion.current
    borrarSesion()
    setSesion(null)
    setAvisoSesion('')
    setCargandoSesion(false)
    navegar('/', { replace: true })
  }

  if (cargandoSesion) {
    return <main role="status">Cargando sesión…</main>
  }

  return (
      <>
        {avisoSesion && <p role="alert">{avisoSesion}</p>}

        {/* Al navegar, la nueva página parte desde arriba (como en la Ev1) */}
        <SubirAlInicio />

        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route
              path="/"
              element={
                <LayoutTienda
                    usuario={sesion}
                    cantidadCarrito={cantidadCarrito}
                    onCerrarSesion={cerrarSesion}
                />
              }
          >
            <Route
                index
                element={<Inicio productos={productos} />}
            />

            <Route
                path="productos"
                element={<Catalogo productos={productos} />}
            />

            <Route
                path="producto/:codigo"
                element={<DetalleProducto productos={productos} />}
            />

            <Route
                path="carrito"
                element={
                  <Carrito
                      productos={productos}
                      sesion={sesion}
                      onCompraRealizada={async () => {
                        const actualizados = await obtenerProductos()

                        if (Array.isArray(actualizados)) {
                          setProductos(actualizados)
                        }
                      }}
                  />
                }
            />

            <Route
                path="login"
                element={<Login onIniciarSesion={iniciarSesion} />}
            />

            {/* S08 / S3-09: el registro crea el usuario en la API y deja la sesión iniciada */}
            <Route
                path="registro"
                element={<Registro onRegistrar={iniciarSesion} />}
            />

            <Route path="nosotros" element={<Nosotros />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:id" element={<DetalleBlog />} />
            <Route path="contacto" element={<Contacto />} />

            {/* J3-10: solo clientes autenticados pueden consultar sus compras. */}
            <Route
                element={
                  <RutaProtegida
                      sesion={sesion}
                      perfilesPermitidos={['Cliente']}
                  />
                }
            >
              <Route
                  path="mis-compras"
                  element={<MisCompras />}
              />

              <Route
                  path="mis-compras/:id"
                  element={<DetalleCompra />}
              />
            </Route>

            {/* J3-06: página visible cuando un usuario autenticado no tiene permisos. */}
            <Route
                path="403"
                element={<AccesoDenegado sesion={sesion} />}
            />

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
            <Route
                path="/admin"
                element={
                  <LayoutAdmin
                      sesion={sesion}
                      onCerrarSesion={cerrarSesion}
                  />
                }
            >
              <Route
                  index
                  element={
                    <InicioAdmin
                        sesion={sesion}
                        productos={productos}
                    />
                  }
              />

              <Route
                  path="ordenes"
                  element={<OrdenesAdmin />}
              />

              <Route
                  path="ordenes/:id"
                  element={<DetalleOrden />}
              />

              {/* C3-07: listado y eliminación mediante API */}
              <Route
                  path="productos"
                  element={
                    <ProductosAdmin
                        puedeGestionar={
                            sesion?.tipoUsuario === 'Administrador'
                        }
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
            <Route
                path="/admin"
                element={
                  <LayoutAdmin
                      sesion={sesion}
                      onCerrarSesion={cerrarSesion}
                  />
                }
            >
              <Route
                  path="productos/nuevo"
                  element={<EditorProducto />}
              />

              <Route
                  path="productos/:codigo/editar"
                  element={<EditorProducto />}
              />

              {/* S3-10: las páginas de usuarios consultan la API */}
              <Route
                  path="usuarios"
                  element={<UsuariosAdmin sesion={sesion} />}
              />

              <Route
                  path="usuarios/nuevo"
                  element={<EditorUsuario />}
              />

              <Route
                  path="usuarios/:run"
                  element={<VerUsuario />}
              />

              <Route
                  path="usuarios/:run/editar"
                  element={<EditorUsuario />}
              />
            </Route>
          </Route>
        </Routes>
      </>
  )
}

export default App
