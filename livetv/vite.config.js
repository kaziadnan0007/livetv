import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/iptv-proxy': {
        target: 'https://iptv-org.github.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/iptv-proxy/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          videojs: ['video.js', '@videojs/http-streaming'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
