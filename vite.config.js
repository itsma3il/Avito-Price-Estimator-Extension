import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve,dirname } from 'path';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.js'),

        background: resolve(__dirname, 'src/background.js'),
        index: resolve(__dirname, 'index.html'),
        standalone: resolve(__dirname, 'src/standalone/index.html')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  css: {
    modules: false,
  }
});