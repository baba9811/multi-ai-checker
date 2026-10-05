import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  root: 'tests/browser/harness',
  plugins: [react()],
  server: { port: 4173, strictPort: true },
});
