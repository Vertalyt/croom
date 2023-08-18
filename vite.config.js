import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default ({ command }) => {
  const isProduction = command === 'build';

  const base = isProduction ? './croomTemplate/' : '/';

  return defineConfig({
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
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
