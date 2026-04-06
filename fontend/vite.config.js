import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: Number(env.VITE_PORT),
    },
    preview: {
      port: Number(env.VITE_PORT),
      allowedHosts: [
        env.ALLOW_HOST
      ],
    },
    plugins: [react()],
  }
});
