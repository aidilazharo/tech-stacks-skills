import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { strictPort: true, proxy: { '/api': 'http://127.0.0.1:' + (process.env.API_PORT || '3001') } },
  test: { environment: 'jsdom', include: ['src/**/*.{test,spec}.{ts,tsx}'] },
});
