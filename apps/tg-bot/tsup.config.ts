import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  format: ['cjs'],
  target: 'node18',
  outDir: './dist',
})
