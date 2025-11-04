import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@localeasy/core',
      fileName: 'core',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['fs', 'path'],
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
