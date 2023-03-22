import { defineConfig } from 'vite'
import analog from '@analogjs/platform'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  publicDir: 'src/assets',
  build: { target: ['es2020'] },
  resolve: { mainFields: ['module'] },
  plugins: [analog({ static: true }), tsconfigPaths()],
})
