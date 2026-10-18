
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'

// Bootstrap: cargar primero
import 'bootstrap/dist/css/bootstrap.min.css'

// CSS originales de Pastelería Mil Sabores
import './estilos/tema.css'
import './estilos/componentes.css'
import './estilos/formularios.css'
import './estilos/tienda.css'
import './estilos/admin.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
