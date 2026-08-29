import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'REACT_APP_'],
    define: {
      'process.env.REACT_APP_BASE_URL': JSON.stringify(
        env.REACT_APP_BASE_URL || 'https://mern-blog-app-2-61qd.onrender.com'
      ),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
