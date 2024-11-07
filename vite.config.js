import { defineConfig, loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';

export default defineConfig((command, mode) => {
  const env = loadEnv(mode, process.cwd(), '');

  const processEnvValues = {
    global: {},
    'process.env': Object.entries(env).reduce((prev, [key, val]) => ({
      ...prev, [key]: val,
    }), {}),
  };

  const HTTPS = (env.HTTPS === 'true');
  const PORT = env.PORT ?? 3000;

  return {
    server: {
      open: true,
      https: HTTPS,
      port: PORT,
      strictPort: true,
    },
    optimizeDeps: {
      include: ['@opentext/forms-client'], // for local dev build
    },
    build: {
      outDir: 'build',
      commonjsOptions: {
        include: [/forms-client/, /node_modules/],
      },
    },
    plugins: [
      react(),
      basicSsl(),
    ],
    resolve: {
      alias: {
        src: '/src',
        assets: '/src/assets',
        components: '/src/components',
        context: '/src/context',
        data: '/src/data',
        hooks: '/src/hooks',
        pages: '/src/pages',
        sections: '/src/sections',
        utils: '/src/utils',
      },
    },
    define: processEnvValues,
  };
});
