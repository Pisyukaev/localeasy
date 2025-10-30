import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import path from 'path';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@localeasy/core',
      fileName: 'core',
    },
    rollupOptions: {
      external: ['fs', 'path'],
    },
  },
});
