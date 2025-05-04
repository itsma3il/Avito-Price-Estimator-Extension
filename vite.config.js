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
        // Main extension files
        content: resolve(__dirname, 'src/content.js'),
        background: resolve(__dirname, 'src/background.js'),
        // Popup page
        index: resolve(__dirname, 'index.html')
      },
      output: {
        // No hashes for extension scripts
        entryFileNames: '[name].js',
        // Hashed assets
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Hashed chunks (if any)
        chunkFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  css: {
    // Extract CSS to assets folder
    modules: false,
    postcss: null
  }
});