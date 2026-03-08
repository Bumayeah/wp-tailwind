import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

export default defineConfig({
  plugins: [
    // VueRouter must come before vue()
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        VueRouterAutoImports,
        '@vueuse/core',
        { '@tanstack/vue-query': ['useQuery', 'useMutation', 'useQueryClient'] },
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dirs: ['src/shared/components', 'src/features'],
      dts: 'src/components.d.ts',
    }),
  ],
  base: process.env.NODE_ENV === 'production' ? '/wp-tailwind/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'query': ['@tanstack/vue-query'],
          'utils': ['zod', 'date-fns', 'dompurify'],
        },
      },
    },
  },
})
