import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/configuracion.js',
    // Las pruebas que llenan formularios completos tardan más (sobre todo midiendo cobertura)
    testTimeout: 15000,
    // S13: reporte de cobertura (npm run test:cobertura)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/configuracion.js',
        'src/**/*.test.{js,jsx}',
        'src/**/*Provisionales.jsx',
      ],
    },
  },
})