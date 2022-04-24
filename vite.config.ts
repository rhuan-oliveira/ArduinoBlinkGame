import { resolve } from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  root:'public',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        admin: resolve(__dirname, 'public/admin/index.html')
      }
    },
    emptyOutDir: true
  }
})