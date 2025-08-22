/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { defineConfig } from 'vite';

const readEnvironment = async () => {
  const env = {};
  const fileStream = fs.createReadStream('.env');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (/^(export\s+)?(VV_)/g.test(line)) {
      const token = line.replace(/^export\s+/, '');
      env[token.split('=')[0]] = token.split('=')[1];
    }
  }
  return env;
};

// https://vitejs.dev/config/
const env = readEnvironment();

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      const newHTML = html.replace(/%%(.*?)%%/g, (_match, p1) => {
        return env[p1] ?? '';
      });
      return newHTML;
    },
  };
};

// Inject only required secrets from .env file
const envWithProcessPrefix = {
  'process.env': `${JSON.stringify(env)}`,
  global: {},
};
console.log(`ENVIRONMENT: `, envWithProcessPrefix);
export default defineConfig({
  plugins: [react(), htmlPlugin()],
  define: envWithProcessPrefix,

  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    proxy: {
      '/customers': {
        target: 'https://vv-report.vv.local',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('4200-proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('4200-Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('4200-Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'path', replacement: 'path-browserify' }, // this!!
    ],
  },
});
