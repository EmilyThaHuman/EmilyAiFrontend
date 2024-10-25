import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import monacoEditorPluginModule from 'vite-plugin-monaco-editor';
const monacoEditorPlugin = monacoEditorPluginModule.default;
// --- FILE PATHS --- //
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    // --- PLUGINS --- //
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'offline.html'], // Include offline fallback
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
              type: 'image/ico',
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
              urlPattern: /^https:\/\/localHost:3001\.com\/.*/, // Adjust to your API domain
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 300, // 5 minutes
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
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                },
              },
            },
            // Add more runtime caching rules as needed
          ],
          clientsClaim: true,
          skipWaiting: true,
          sourcemap: true,
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: '/offline.html',
                  navigateFallbackAllowlist: [/^index.html$/]

        },
      }),
      monacoEditorPlugin({
        languageWorkers: ['json', 'css', 'html', 'typescript'],
      }),
    ],
    // --- CONFIG --- //
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/humanIcons': path.resolve(__dirname, 'src/assets/humanIcons'),
        '@/routes': path.resolve(__dirname, 'src/routes'),
        '@/colors': path.resolve(__dirname, 'src/assets/themes/base'),
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/app': path.resolve(__dirname, 'src/app'),
        // '@/api': path.resolve(__dirname, 'src/api'),
        // '@/assets': path.resolve(__dirname, 'src/assets'),
        // '@/components': path.resolve(__dirname, 'src/components'),
        // '@/contexts': path.resolve(__dirname, 'src/contexts'),
        // '@/hooks': path.resolve(__dirname, 'src/hooks'),
        // '@/styles': path.resolve(__dirname, 'src/styles'),
        // '@/layouts': path.resolve(__dirname, 'src/layouts'),
        // '@/store': path.resolve(__dirname, 'src/store'),
        // '@/types': path.resolve(__dirname, 'src/types'),
        // '@/utils': path.resolve(__dirname, 'src/utils'),
        // '@/views': path.resolve(__dirname, 'src/views'),
        app: path.resolve(__dirname, 'src/app'),
        api: path.resolve(__dirname, 'src/api'),
        assets: path.resolve(__dirname, 'src/assets'),
        components: path.resolve(__dirname, 'src/components'),
        config: path.resolve(__dirname, 'src/config'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        styles: path.resolve(__dirname, 'src/styles'),
        layouts: path.resolve(__dirname, 'src/layouts'),
        store: path.resolve(__dirname, 'src/store'),
        types: path.resolve(__dirname, 'src/types'),
        utils: path.resolve(__dirname, 'src/utils'),
        views: path.resolve(__dirname, 'src/views'),
      },
    },
    // --- DEFINE --- //
    define: {
      ...Object.keys(env).reduce((prev, key) => {
        prev[`process.env.${key}`] = JSON.stringify(env[key]);
        return prev;
      }, {}),
    },
    build: {
      rollupOptions: {
        external: ['monaco-editor'],
      },
    },
    // --- SERVER --- //
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
  };
});
