import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': new URL('./src/', import.meta.url).pathname
    }
  },
  optimizeDeps: {
    include: [], // Указать зависимости, которые нужно включить
  },
  build: {
    chunkSizeWarningLimit: 1000, // Установите желаемый лимит в килобайтах
  },
});