import { defineConfig } from 'vite'
import { createVuePlugin } from "vite-plugin-vue2"
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [createVuePlugin()],
})
