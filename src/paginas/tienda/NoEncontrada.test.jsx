import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import NoEncontrada from './NoEncontrada'

afterEach(cleanup)

describe('J11 - Página NoEncontrada', () => {
  it('muestra el error 404 y un enlace al inicio', () => {
    render(
      <MemoryRouter initialEntries={['/pagina-inexistente']}>
        <Routes>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })

  it('permite navegar al inicio desde el enlace', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const usuario = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/ruta-que-no-existe']}>
        <Routes>
          <Route path="/" element={<h1>Inicio de la tienda</h1>} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </MemoryRouter>
    )

    await usuario.click(screen.getByRole('link', { name: 'Volver al inicio' }))
    expect(screen.getByRole('heading', { name: 'Inicio de la tienda' })).toBeInTheDocument()
  })
})
