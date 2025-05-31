import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';
import path from 'node:path';
import { createLogger, defineConfig } from 'vite';

let react;
try {
  react = require('@vitejs/plugin-react');
} catch (e) {
  console.error("⚠️  Plugin '@vitejs/plugin-react' tidak ditemukan. Gunakan 'npm install --save-dev @vitejs/plugin-react'");
  react = () => ({ name: 'empty-react-plugin' });
}

const configHorizonsViteErrorHandler = `...`;  // Tidak diubah
const configHorizonsRuntimeErrorHandler = `...`;  // Tidak diubah
const configHorizonsConsoleErrroHandler = `...`;  // Tidak diubah
const configWindowFetchMonkeyPatch = `...`;  // Tidak diubah

const addTransformIndexHtml = {
  name: 'add-transform-index-html',
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        { tag: 'script', attrs: { type: 'module' }, children: configHorizonsRuntimeErrorHandler, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'module' }, children: configHorizonsViteErrorHandler, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'module' }, children: configHorizonsConsoleErrroHandler, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'module' }, children: configWindowFetchMonkeyPatch, injectTo: 'head' },
      ],
    };
  },
};

console.warn = () => {};

const logger = createLogger();
const loggerError = logger.error;

logger.error = (msg, options) => {
  if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
    return;
  }
  loggerError(msg, options);
};

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@noble/secp256k1']
    }
  },
  customLogger: logger,
  plugins: [react(), addTransformIndexHtml, wasm(), topLevelAwait()],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
