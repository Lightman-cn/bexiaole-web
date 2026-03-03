import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'AI伯乐网 - 智能猎头招聘平台',
        short_name: 'AI伯乐',
        description: '智能猎头招聘平台，为企业和人才提供高效的招聘服务',
        theme_color: '#1a2b4a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unpkg-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/hm\.baidu\.com\/.*/i,
            handler: 'NetworkOnly',
            options: {}
          },
          {
            urlPattern: /^https:\/\/www\.clarity\.ms\/.*/i,
            handler: 'NetworkOnly',
            options: {}
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 移动端性能优化配置
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 第三方库分割 - React 核心
          'vendor-react': ['react', 'react-dom'],
          // Radix UI 组件库
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
          ],
          // UI 工具库
          'vendor-ui': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          // 轮播组件
          'vendor-carousel': ['embla-carousel-react'],
          // Toast 通知
          'vendor-sonner': ['sonner'],
        },
      },
    },
    // 使用 esbuild 压缩（默认，更快且兼容性好）
    minify: 'esbuild',
    // 分包大小警告阈值
    chunkSizeWarningLimit: 500,
    // 关闭源码映射以减小体积
    sourcemap: false,
    // CSS 代码分割
    cssCodeSplit: true,
  },
  // 预加载关键依赖
  optimizeDeps: {
    include: ['react', 'react-dom', 'sonner'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
})