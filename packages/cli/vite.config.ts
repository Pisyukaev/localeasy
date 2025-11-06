import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@localeasy/cli',
      fileName: 'bin',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['commander', 'readline', 'fs', 'path', 'readline/promises'],
      output: {
        globals: {
          commander: 'commander',
          readline: 'readline',
        },
      },
    },
  },
});
