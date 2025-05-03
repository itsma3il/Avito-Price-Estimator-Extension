import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),tailwindcss(),
    crx({ 
      manifest,
      build: {
        emptyOutDir: true,
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html'),
            content: resolve(__dirname, 'src/content.js'),
            background: resolve(__dirname, 'src/background.js')
          },
          output: {
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'src/[name].js',
            assetFileNames: 'assets/[name]-[hash][extname]'
          }
        }
      }
    })
  ]
});