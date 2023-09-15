import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default () => {

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': new URL('./src/', import.meta.url).pathname
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    }
  });
};
