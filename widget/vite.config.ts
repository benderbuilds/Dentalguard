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
    rollupOptions: {
      // Bundle everything (React included) into a single file
    },
    cssCodeSplit: false,
    outDir: '../public',
    emptyOutDir: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
