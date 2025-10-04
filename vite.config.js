import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',         // Vite serves from this folder
  build: {
    outDir: '../dist'     // Output build folder
  },
  server: {
    port: 8000,
    open: true
  }
})
