// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': "https://abctelemed-app.vercel.app",
      // '/api': "http://localhost:5000"
    },
  },
});
