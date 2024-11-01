import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import monacoEditorPluginModule from 'vite-plugin-monaco-editor';

// Constants
const monacoEditorPlugin = monacoEditorPluginModule.default;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONACO_WORKERS = ['json', 'css', 'html', 'typescript'];
const PWA_CACHE_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds

const DIRECTORIES = [
  'api',
  'app',
  'assets',
  'components',
  'config',
  'contexts',
  'hooks',
  'layouts',
  'lib',
  'routes',
  'store',
  'styles',
  'types',
  'utils',
  'views',
  'humanIcons',
  'services',
  'colors',
];

const createAliases = (basePath, dirs) => {
  const aliases = { '@': basePath };
  dirs.forEach(dir => {
    aliases[`@/${dir}`] = path.join(basePath, dir);
    aliases[dir] = path.join(basePath, dir);
  });
  return aliases;
};
// PWA Configuration
const pwaConfig = {
  registerType: 'autoUpdate', // Changed from 'none' for better PWA experience
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'offline.html'],
  manifest: {
    name: 'ReedAi',
    short_name: 'RAI',
    description:
      "Your AI React Component Assistant: ReedAi is a frontend development tool that helps you create React components using AI. It's a great tool for frontend developers who want to speed up their development process.",
    theme_color: '#18b984',
    background_color: '#000000',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: 'icon-192x192.png',
        type: 'image/png', // Fixed incorrect type
        sizes: '192x192',
      },
      {
        src: 'icon-256x256.png',
        type: 'image/png',
        sizes: '256x256',
      },
      {
        src: 'icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/localhost:3001\/.*/, // Fixed regex pattern
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 300,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: PWA_CACHE_DURATION,
          },
        },
      },
    ],
    clientsClaim: true,
    skipWaiting: true,
    sourcemap: process.env.NODE_ENV === 'development',
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const isDev = mode === 'development';

  return {
    plugins: [
      react({ jsxRuntime: 'automatic' }),
      svgr(),
      VitePWA(pwaConfig),
      monacoEditorPlugin({ languageWorkers: MONACO_WORKERS }),
    ],
    resolve: {
      alias: createAliases(path.resolve(__dirname, 'src'), DIRECTORIES),
    },
    define: {
      ...Object.fromEntries(
        Object.entries(env).map(([key, value]) => [
          `process.env.${key}`,
          JSON.stringify(value),
        ])
      ),
    },
    build: {
      rollupOptions: {
        external: ['monaco-editor'],
      },
      sourcemap: isDev,
      minify: !isDev,
      chunkSizeWarningLimit: 1000, // Increased from default
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      hmr: {
        overlay: true,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
