import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@AppBuilderShared": path.resolve(__dirname, "./src/shared"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
})
