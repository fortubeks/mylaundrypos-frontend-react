import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static-html',
      closeBundle() {
        // Copy static HTML files to dist during build
        try {
          copyFileSync(
            path.resolve(__dirname, 'public/landing.html'),
            path.resolve(__dirname, 'dist/landing.html')
          )
          copyFileSync(
            path.resolve(__dirname, 'public/signin.html'),
            path.resolve(__dirname, 'dist/signin.html')
          )
          copyFileSync(
            path.resolve(__dirname, 'public/signup.html'),
            path.resolve(__dirname, 'dist/signup.html')
          )
        } catch (error) {
          console.warn('Failed to copy static HTML files:', error)
        }
      },
    },
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  publicDir: 'public',
})

