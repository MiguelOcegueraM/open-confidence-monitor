import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Listen on the LAN so a stage laptop or tablet can open /display.
    host: true,
    open: false,
    fs: {
      strict: false
    }
  }
});
