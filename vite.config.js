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
  server: {
    host: true,
    proxy: {
      // '/aj_project': {
      //   target: 'http://157.0.243.82:9090/',
      //   changeOrigin: true
      // }
    }
  },
  plugins: [createVuePlugin()],
})
