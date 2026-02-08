import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'DentalPilotWidget',
      fileName: () => 'dentalpilot-widget.js',
      formats: ['iife'],
    },
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
