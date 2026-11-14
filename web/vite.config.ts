import { defineConfig } from 'vite';

// GitHub Pages serves the site under /<repository>/: the workflow sets VITE_BASE.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  build: { target: 'es2022', chunkSizeWarningLimit: 4000 },
});
